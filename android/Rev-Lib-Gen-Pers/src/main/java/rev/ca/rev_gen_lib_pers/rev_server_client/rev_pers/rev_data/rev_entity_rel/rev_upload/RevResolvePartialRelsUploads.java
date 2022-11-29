package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_data.rev_entity_rel.rev_upload;

import android.content.Context;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityRelationship;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibUpdate;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.IRevAsyncJSONPostTask;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.RevAsyncJSONPostTaskService;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;
import rev.ca.rev_gen_lib_pers.rev_varags_data.RevVarArgsData;
import rev.ca.rev_lib_gen_functions.I_REV_PROCESS_FINISH;

public class RevResolvePartialRelsUploads {

    private Context mContext;

    private I_REV_PROCESS_FINISH i_rev_process_finish;

    private RevPersLibRead revPersLibRead = new RevPersLibRead();
    private RevPersLibUpdate revPersLibUpdate = new RevPersLibUpdate();

    String postURL = REV_SESSION_SETTINGS.getRevRemoteServer() + "/rev_api/get_partial_sync_rel_id";

    public RevResolvePartialRelsUploads(RevVarArgsData revVarArgsData, I_REV_PROCESS_FINISH i_rev_process_finish) {
        this.mContext = revVarArgsData.getmContext();
        this.i_rev_process_finish = i_rev_process_finish;

        this.syncNewRevEntities();
    }

    private JSONObject revSyncJSONObjects() {
        JSONObject jsonObject = new JSONObject();
        JSONArray array = new JSONArray();

        List<RevEntityRelationship> revEntityRelationshipList = revPersLibRead.revPersGetRevEntityRels_By_ResStatus(-101);

        if (revEntityRelationshipList.size() < 1) {
            i_rev_process_finish.REV_PROCESS_FINISH(new Long(122));
            return null;
        }

        for (RevEntityRelationship revEntityRelationship : revEntityRelationshipList) {
            JSONObject revEntityRelationshipJSON = new JSONObject();
            try {
                revEntityRelationshipJSON
                        .put("_remoteRevEntitySubjectGUID", revEntityRelationship.get_remoteRevEntitySubjectGUID())
                        .put("_remoteRevEntityTargetGUID", revEntityRelationship.get_remoteRevEntityTargetGUID())
                        .put("_revEntityRelationshipId", revEntityRelationship.get_revEntityRelationshipId())
                        .put("_revTimeCreated", revEntityRelationship.get_revTimeCreated());

                array.put(revEntityRelationshipJSON);

                revPersLibUpdate.revPersUpdateRelResStatus_By_RelId(revEntityRelationship.get_revEntityRelationshipId(), -107);
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

    private void syncNewRevEntities() {
        JSONObject revSyncObjs = this.revSyncJSONObjects();

        if (revSyncObjs != null) {
            new RevAsyncJSONPostTaskService(mContext, postURL, revSyncObjs).revPostJSON(new IRevAsyncJSONPostTask() {
                @Override
                public void processFinishAsyncJSONPostTask(JSONObject jsonObject) {
                    JSONArray jArr;
                    try {
                        jArr = jsonObject.getJSONArray("filter");

                        for (int i = 0; i < jArr.length(); i++) {
                            JSONObject revRetJSONData = jArr.getJSONObject(i);

                            long _revEntityRelationshipId = revRetJSONData.getLong("_revEntityRelationshipId");
                            long _remoteRevEntityRelationshipId = revRetJSONData.getLong("_remoteRevEntityRelationshipId");

                            if (_remoteRevEntityRelationshipId > 0) {
                                revPersLibUpdate.revPersSetRemoteRelationshipResolved(_revEntityRelationshipId, _remoteRevEntityRelationshipId);
                            } else {
                                revPersLibUpdate.revPersUpdateRelResStatus_By_RelId(_revEntityRelationshipId, -1);
                            }
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                    syncNewRevEntities();
                }
            });
        }
    }
}
