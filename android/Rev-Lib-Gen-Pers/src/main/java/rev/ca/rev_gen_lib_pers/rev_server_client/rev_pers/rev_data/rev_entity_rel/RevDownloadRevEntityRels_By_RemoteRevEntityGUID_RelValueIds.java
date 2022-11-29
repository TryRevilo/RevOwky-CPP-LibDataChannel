package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_data.rev_entity_rel;

import android.content.Context;

import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityRelationship;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibUpdate;
import rev.ca.rev_gen_lib_pers.c_libs_core.rev_java_lib.RevPersJava;
import rev.ca.rev_gen_lib_pers.rev_server_client.RevJSONEntityClassConstructor;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server.IRevAsyncJSONResponse;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server.RevAsyncGetJSONResponseTaskService;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;

public class RevDownloadRevEntityRels_By_RemoteRevEntityGUID_RelValueIds {

    private Context mContext;

    private RevPersLibRead revPersLibRead = new RevPersLibRead();
    private RevPersLibUpdate revPersLibUpdate = new RevPersLibUpdate();

    public RevDownloadRevEntityRels_By_RemoteRevEntityGUID_RelValueIds(Context mContext) {
        this.mContext = mContext;
    }

    public void revDownloadRevEntityRels_By_RemoteRevEntityGUID_RelValueIds(long remoteRevEntityGUID, String revRelValIds) {
        String getAllRevEntities_By_OwnerGUIDs_apiURL = REV_SESSION_SETTINGS.getRevRemoteServer()
                + "/rev_api/get_all_revEntity_rels_by_remote_rev_entity_GUID_rel_value_ids?remote_rev_entity_guid="
                + remoteRevEntityGUID + "&rel_values_ids=" + revRelValIds;

        new RevAsyncGetJSONResponseTaskService(mContext, getAllRevEntities_By_OwnerGUIDs_apiURL, new IRevAsyncJSONResponse() {
            @Override
            public void processFinishAsyncJSONResponse(JSONObject jsonObject) {
                if (jsonObject == null) return;

                JSONArray jArr;
                JSONArray jArrRels;
                try {
                    jArr = jsonObject.getJSONArray("filter");

                    if (jArr == null) return;

                    jArrRels = jsonObject.getJSONArray("filledRevRel");

                    if (jArrRels == null) return;

                    List<RevEntity> revEntityList = new ArrayList<>();
                    List<RevEntityRelationship> revEntityRelationships = new ArrayList<>();

                    RevJSONEntityClassConstructor revJSONEntityClassConstructor = new RevJSONEntityClassConstructor();

                    for (int i = 0; i < jArr.length(); i++) {
                        JSONObject e;
                        try {
                            e = jArr.getJSONObject(i);
                            RevEntity revEntity = revJSONEntityClassConstructor.getClassRevEntity_From_JSON(e);
                            if (revEntity == null) continue;

                            revEntityList.add(revEntity);
                        } catch (JSONException e1) {
                            e1.printStackTrace();
                        }
                    }

                    for (int i = 0; i < jArrRels.length(); i++) {
                        JSONObject e;
                        try {
                            e = jArrRels.getJSONObject(i);
                            RevEntityRelationship revEntityRelationship = new Gson().fromJson(e.toString(), RevEntityRelationship.class);
                            if (revEntityRelationship == null) continue;

                            revEntityRelationships.add(revEntityRelationship);
                        } catch (JSONException e1) {
                            e1.printStackTrace();
                        }
                    }

                    RevPersJava revPersJava = new RevPersJava();

                    for (RevEntity revEntity : revEntityList) {
                        if (revEntity == null) continue;

                        revEntity.set_revEntityResolveStatus(0);

                        Long revEntityGUID;

                        if (revPersLibRead.revEntityExistsByRemoteEntityGUID(revEntity.get_remoteRevEntityGUID()) == -1) {
                            revEntityGUID = (Long) revPersJava.saveRevEntity_NO_REMOTE_SYNC(revEntity);

                            List<RevEntity> revChildrenEntities = revEntity.get_revEntityChildrenList();

                            for (RevEntity revChildEntity : revChildrenEntities) {
                                revChildEntity.set_revEntityResolveStatus(0);
                                revChildEntity.set_revEntityOwnerGUID(revEntityGUID);

                                if (revPersLibRead.revEntityExistsByRemoteEntityGUID(revChildEntity.get_remoteRevEntityGUID()) == -1)
                                    revPersJava.saveRevEntity_NO_REMOTE_SYNC(revChildEntity);
                            }

                            String revEntityRelType = (revEntity.get_revEntityType().equals("rev_user_entity")) ? "rev_entity_connect_members" : "rev_entity_space_member";

                            RevEntityRelationship revEntityRelationship = null;

                            if (revEntity.get_revEntityType().equals("rev_user_entity")) {
                                revEntityRelationship = new RevEntityRelationship(
                                        revEntityRelType,
                                        revEntityGUID,
                                        REV_SESSION_SETTINGS.getRevLoggedInEntityGuid());
                                revEntityRelationship.set_remoteRevEntityTargetGUID(REV_SESSION_SETTINGS.getRevLoggedInRemoteEntityGuid());
                                revEntityRelationship.set_remoteRevEntitySubjectGUID(revEntity.get_remoteRevEntityGUID());
                            } else if (revEntity.get_revEntityType().equals("rev_group_entity")) {
                                revEntityRelationship = new RevEntityRelationship(
                                        revEntityRelType,
                                        REV_SESSION_SETTINGS.getRevLoggedInEntityGuid(),
                                        revEntityGUID);
                                revEntityRelationship.set_remoteRevEntitySubjectGUID(REV_SESSION_SETTINGS.getRevLoggedInRemoteEntityGuid());
                                revEntityRelationship.set_remoteRevEntityTargetGUID(revEntity.get_remoteRevEntityGUID());
                            }

                            if (revEntityRelationship != null) {
                                revEntityRelationship.set_revResolveStatus(-200);
                                revPersJava.saveRevEntity_NO_REMOTE_SYNC(revEntityRelationship);
                            }
                        }

                        for (RevEntityRelationship entityRelationship : revEntityRelationships) {
                            revPersLibUpdate.revPersUpdateSetRemoteRelationshipRemoteId_By_RevRelType_RemoteSubjectGUID_RemoteTarhetGUID(
                                    entityRelationship.get_revEntityRelationshipType(),
                                    entityRelationship.get_remoteRevEntitySubjectGUID(),
                                    entityRelationship.get_remoteRevEntityTargetGUID(),
                                    entityRelationship.get_remoteRevEntityRelationshipId()
                            );

                            revPersLibUpdate.revPersUpdateSetRelResStatus_By_RemoteRelId(entityRelationship.get_remoteRevEntityRelationshipId(), entityRelationship.get_revResolveStatus());
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }).execute();
    }
}
