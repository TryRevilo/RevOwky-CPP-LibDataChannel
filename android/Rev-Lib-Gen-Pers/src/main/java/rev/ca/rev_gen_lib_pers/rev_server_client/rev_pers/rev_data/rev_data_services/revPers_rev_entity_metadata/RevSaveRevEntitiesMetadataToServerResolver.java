package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_data.rev_data_services.revPers_rev_entity_metadata;

import android.content.Context;

import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibUpdate;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.IRevAsyncJSONPostTask;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.RevAsyncJSONPostTaskService;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;

public class RevSaveRevEntitiesMetadataToServerResolver {

    public interface IRevSaveRevEntitiesMetadataToServerResolver {
        void revProcessFinish();
    }

    private Context mContext;
    private IRevSaveRevEntitiesMetadataToServerResolver delegate;

    String postURL = REV_SESSION_SETTINGS.getRevRemoteServer() + "/rev_api/save_rev_entity_metadata";

    RevPersLibRead revPersLibRead = new RevPersLibRead();
    RevPersLibUpdate revPersLibUpdate = new RevPersLibUpdate();

    public RevSaveRevEntitiesMetadataToServerResolver(Context mContext, IRevSaveRevEntitiesMetadataToServerResolver iRevSaveRevEntitiesMetadataToServerResolver) {
        this.mContext = mContext;
        this.delegate = iRevSaveRevEntitiesMetadataToServerResolver;

        this.syncNewRevEntitiesMetadata();
    }

    private JSONObject syncObjs() {
        List<Long> longList = revPersLibRead.revPersGetALLRevEntityMetadataIds_By_ResStatus(-1);

        if (longList.size() < 1) return null;

        List<RevEntityMetadata> revUnsynchedEntityMetadataList = new ArrayList<>();

        for (long revMetadataId : longList) {
            RevEntityMetadata revEntityMetadata = revPersLibRead.revPersGetRevEntityMetadata_By_MetadataId(revMetadataId);

            if (revEntityMetadata.getRevMetadataId().longValue() < 0) {
                revPersLibUpdate.setMetadataResolveStatus_BY_METADATA_ID(-3, revMetadataId);
                continue;
            }

            revUnsynchedEntityMetadataList.add(revEntityMetadata);

            revPersLibUpdate.setMetadataResolveStatus_BY_METADATA_ID(-101, revMetadataId);
        }

        JSONObject jsonObject = new JSONObject();
        JSONArray array = new JSONArray();

        for (RevEntityMetadata revEntityMetadata : revUnsynchedEntityMetadataList) {
            if (revEntityMetadata.getRevMetadataOwnerGUID() < 0) {
                revPersLibUpdate.setMetadataResolveStatus_BY_METADATA_ID(-3, revEntityMetadata.getRevMetadataId());
                continue;
            }

            Long remoteRevEntityGUID = revPersLibRead.getRemoteRevEntityGUID(revEntityMetadata.getRevMetadataOwnerGUID());

            if (remoteRevEntityGUID < 0) {
                revPersLibUpdate.setMetadataResolveStatus_BY_METADATA_ID(-107, revEntityMetadata.getRevMetadataId());
                continue;
            }

            revEntityMetadata.setRevMetadataOwnerGUID(remoteRevEntityGUID);
            Gson gson = new Gson();
            String json = gson.toJson(revEntityMetadata);

            try {
                array.put(new JSONObject(json));
                revPersLibUpdate.setMetadataResolveStatus_BY_METADATA_ID(-101, revEntityMetadata.getRevMetadataId());
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

    private void syncNewRevEntitiesMetadata() {
        JSONObject jsonObject = this.syncObjs();

        if (jsonObject != null) {
            new RevAsyncJSONPostTaskService(mContext, postURL, jsonObject).revPostJSON(new IRevAsyncJSONPostTask() {
                @Override
                public void processFinishAsyncJSONPostTask(JSONObject jsonObject) {
                    JSONArray jArr;
                    try {
                        jArr = jsonObject.getJSONArray("filter");
                        setRemoteRevEntityMetadataId(jArr);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                    syncNewRevEntitiesMetadata();
                }
            });
        } else {
            delegate.revProcessFinish();
        }
    }

    private void setRemoteRevEntityMetadataId(JSONArray jsonArray) {
        if (jsonArray.length() == 0) {
        } else {
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject e;
                try {
                    e = jsonArray.getJSONObject(i);
                    Long localMetadataId = Long.parseLong(e.getString("localMetadataId"));
                    Long remoteMetadataId = Long.parseLong(e.getString("metadataId"));

                    if (remoteMetadataId < 1) {
                        revPersLibUpdate.setMetadataResolveStatus_BY_METADATA_ID(-1, localMetadataId);
                        continue;
                    }

                    revPersLibUpdate.setRemoteRevEntityMetadataId(localMetadataId, remoteMetadataId);
                    revPersLibUpdate.setMetadataResolveStatus_BY_METADATA_ID(0, localMetadataId);
                } catch (JSONException e1) {
                    e1.printStackTrace();
                }
            }
        }
    }
}
