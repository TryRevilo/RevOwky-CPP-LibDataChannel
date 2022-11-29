package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_entity;

import android.content.Context;

import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibUpdate;
import rev.ca.rev_gen_lib_pers.rev_pers_file.RevSaveRemoteFileNamesMetadata;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_data.rev_data_services.revPers_rev_entity_metadata.RevSaveRevEntitiesMetadataToServerResolver;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_data.rev_entity_rel.rev_upload.RevSaveRevEntityRelationshipToServerResolver;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.IRevAsyncJSONPostTask;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.RevAsyncJSONPostTaskService;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;
import rev.ca.rev_gen_lib_pers.rev_varags_data.RevVarArgsData;
import rev.ca.rev_lib_gen_functions.I_REV_PROCESS_FINISH;

public class RevSaveRevEntitiesToServerResolver {

    public interface IRevSaveRevEntitiesToServerResolver {
        void revProcessFinish();
    }

    private Context mContext;
    private IRevSaveRevEntitiesToServerResolver iRevSaveRevEntitiesToServerResolver;

    RevPersLibRead revPersLibRead = new RevPersLibRead();
    RevPersLibUpdate revPersLibUpdate = new RevPersLibUpdate();

    public RevSaveRevEntitiesToServerResolver(Context mContext) {
        this.mContext = mContext;
    }

    public RevSaveRevEntitiesToServerResolver(Context mContext, IRevSaveRevEntitiesToServerResolver iRevSaveRevEntitiesToServerResolver) {
        this.mContext = mContext;
        this.iRevSaveRevEntitiesToServerResolver = iRevSaveRevEntitiesToServerResolver;

        this.syncNewRevEntities();
    }

    private JSONObject syncObjs() {
        List<RevEntity> revEntities = Arrays.asList(revPersLibRead.revPersGetALLRevEntityUnSyched());
        List revUserEntitiesList = Arrays.asList(revPersLibRead.revPersGetALLRevEntityUnSychedByType("rev_user_entity"));

        if (!revUserEntitiesList.isEmpty()) revEntities = revUserEntitiesList;

        if (!revEntities.isEmpty()) {
            JSONObject jsonObject = new JSONObject();
            JSONArray array = new JSONArray();

            for (RevEntity revEntity : revEntities) {
                if (revEntity == null) continue;

                /** MAKE SURE THAT RES_STATUS < 0 **/
                if (revEntity.get_remoteRevEntityGUID().longValue() > 0) {
                    revPersLibUpdate.setRevEntityResolveStatusByRevEntityGUID(0, revEntity.get_revEntityGUID());
                    continue;
                }

                /** REV RESOLVE OWNER **/
                if (revEntity.get_revEntityOwnerGUID().longValue() > 0) {
                    long revRemoteOwnerGUID = revPersLibRead.getRemoteRevEntityGUID(revEntity.get_revEntityOwnerGUID());

                    if (revRemoteOwnerGUID < 0) {
                        revPersLibUpdate.setRevEntityResolveStatusByRevEntityGUID(-107, revEntity.get_revEntityGUID());
                        continue;
                    }

                    revEntity.set_revEntityOwnerGUID(revRemoteOwnerGUID);
                }

                /** REV RESOLVE CONTAINER **/
                if (revEntity.get_revEntityContainerGUID().longValue() > 0) {
                    long revRemoteContainerGUID = revPersLibRead.getRemoteRevEntityGUID(revEntity.get_revEntityContainerGUID());

                    if (revRemoteContainerGUID < 0) {
                        revPersLibUpdate.setRevEntityResolveStatusByRevEntityGUID(-107, revEntity.get_revEntityGUID());
                        continue;
                    }

                    revEntity.set_revEntityContainerGUID(revRemoteContainerGUID);
                }

                try {
                    array.put(new JSONObject(new Gson().toJson(revEntity)));
                    revPersLibUpdate.setRevEntityResolveStatusByRevEntityGUID(-101, revEntity.get_revEntityGUID());

                    List<RevEntityMetadata> revEntityMetadataList = revEntity.get_revEntityMetadataList();
                    revEntity.get_revEntityMetadataList().clear();

                    for (RevEntityMetadata revEntityMetadata : revEntityMetadataList) {
                        if (revEntityMetadata != null && revEntityMetadata.get_resolveStatus() == -1 && revEntityMetadata.getRevMetadataOwnerGUID().longValue() > 0 && revEntityMetadata.get_revTimeCreated() > 0) {
                            revEntity.get_revEntityMetadataList().add(revEntityMetadata);
                            revPersLibUpdate.setMetadataResolveStatus_BY_METADATA_ID(-101, revEntityMetadata.getRevMetadataId());
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            try {
                jsonObject.put("filter", array);
            } catch (JSONException e) {
                e.printStackTrace();
            }

            return jsonObject;
        }

        return null;
    }

    public void syncNewRevEntities() {
        final JSONObject syncObjs = this.syncObjs();

        if (syncObjs == null) {
            new RevResolvePartialEntityUploads(new RevVarArgsData(mContext), new RevResolvePartialEntityUploads.IRevResolvePartialEntityUploads() {
                @Override
                public void revProcessFinish() {
                    List<Long> revEntityList = revPersLibRead.revPersGetALLRevEntitySubtypeGUIDs_By_ResolveStatus("rev_file", 0);

                    new RevSaveRemoteFileNamesMetadata(revEntityList, new I_REV_PROCESS_FINISH() {
                        @Override
                        public void REV_PROCESS_FINISH(Object o) {
                            if (revPersLibRead.revPersGetALLRevEntitySubtypeGUIDs_By_ResolveStatus("rev_file", 0).isEmpty()) {
                                new RevSaveRevEntitiesMetadataToServerResolver(mContext, new RevSaveRevEntitiesMetadataToServerResolver.IRevSaveRevEntitiesMetadataToServerResolver() {
                                    @Override
                                    public void revProcessFinish() {
                                        new RevSaveRevEntityRelationshipToServerResolver(mContext, new RevSaveRevEntityRelationshipToServerResolver.IRevSaveRevEntityRelationshipToServerResolver() {
                                            @Override
                                            public void revProcesFinish() {
                                                if (iRevSaveRevEntitiesToServerResolver != null)
                                                    iRevSaveRevEntitiesToServerResolver.revProcessFinish();
                                            }
                                        }).execute();
                                    }
                                });
                            } else syncNewRevEntities();
                        }
                    }).execute();
                }
            });
        } else {
            try {
                if (syncObjs.getJSONArray("filter").length() > 0) {
                    String postURL = REV_SESSION_SETTINGS.getRevRemoteServer() + "/sound";

                    new RevAsyncJSONPostTaskService(mContext, postURL, syncObjs).revPostJSON(new IRevAsyncJSONPostTask() {
                        @Override
                        public void processFinishAsyncJSONPostTask(JSONObject jsonObject) {
                            if (jsonObject == null) return;

                            try {
                                JSONArray jArr = jsonObject.getJSONArray("filter");

                                if (jArr == null) return;

                                for (int i = 0; i < jArr.length(); i++) {
                                    JSONObject e;
                                    try {
                                        e = jArr.getJSONObject(i);

                                        long revEntityGUID = e.getLong("_revEntityGUID");
                                        long remoteRevEntityGUID = e.getLong("_remoteRevEntityGUID");
                                        long revTimePublished = e.getLong("_revTimePublished");

                                        if (revEntityGUID > 0 && remoteRevEntityGUID > 0 && revTimePublished > 0) {
                                            revPersLibUpdate.setRemoteRevEntityGUIDByRevEntityGUID(revEntityGUID, remoteRevEntityGUID);
                                            revPersLibUpdate.setRevPublishedDate_By_RevEntityGUID(revEntityGUID, revTimePublished);

                                            JSONArray jsonMetadataArray = e.getJSONArray("_revEntityMetadataList");
                                            if (jsonMetadataArray != null && jsonMetadataArray.length() > 0) {
                                                setRemoteRevEntityMetadataIdelper(e.getJSONArray("_revEntityMetadataList"), 0);
                                            }
                                        } else {
                                            revPersLibUpdate.setRevEntityResolveStatusByRevEntityGUID(-1, revEntityGUID);

                                            JSONArray jsonMetadataArray = e.getJSONArray("_revEntityMetadataList");
                                            if (jsonMetadataArray != null && jsonMetadataArray.length() > 0) {
                                                setRemoteRevEntityMetadataIdelper(e.getJSONArray("_revEntityMetadataList"), -1);
                                            }
                                        }
                                    } catch (JSONException e1) {
                                        e1.printStackTrace();
                                    }
                                }
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }

                            syncNewRevEntities();
                        }
                    });
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    void setRemoteRevEntityMetadataIdelper(JSONArray jsonArray, int revResStatus) {
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject e;
            try {
                e = jsonArray.getJSONObject(i);

                long localMetadataId = e.getLong("localMetadataId");
                long remoteMetadataId = e.getLong("metadataId");
                int revMetadataUpdateStatus = revPersLibUpdate.setRemoteRevEntityMetadataId(localMetadataId, remoteMetadataId);

                if (revMetadataUpdateStatus == 1) {
                    revPersLibUpdate.setMetadataResolveStatus_BY_METADATA_ID(revResStatus, localMetadataId);
                }
            } catch (JSONException e1) {
                e1.printStackTrace();
            }
        }
    }
}
