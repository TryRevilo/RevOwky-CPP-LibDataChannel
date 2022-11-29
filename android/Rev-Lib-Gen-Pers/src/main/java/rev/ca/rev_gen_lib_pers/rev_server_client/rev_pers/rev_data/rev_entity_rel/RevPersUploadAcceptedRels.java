package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_data.rev_entity_rel;

import android.content.Context;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibUpdate;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.IRevAsyncJSONPostTask;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.RevAsyncJSONPostTaskService;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;
import rev.ca.rev_lib_gen_functions.I_REV_PROCESS_FINISH;

public class RevPersUploadAcceptedRels {

    private Context mContext;
    private I_REV_PROCESS_FINISH i_rev_process_finish;

    private RevPersLibRead revPersLibRead = new RevPersLibRead();
    private RevPersLibUpdate revPersLibUpdate = new RevPersLibUpdate();

    public RevPersUploadAcceptedRels(Context mContext) {
        this.mContext = mContext;
    }

    public RevPersUploadAcceptedRels(Context mContext, I_REV_PROCESS_FINISH i_rev_process_finish) {
        this.mContext = mContext;
        this.i_rev_process_finish = i_rev_process_finish;

        this.revUploadAcceptedRels();
    }

    private void revUploadAcceptedRels() {
        String apiURL = REV_SESSION_SETTINGS.getRevRemoteServer() + "/rev_api/sync_accepted_rels";

        JSONObject synchedJSONObjects = syncObjs();

        if (synchedJSONObjects != null) {
            new RevAsyncJSONPostTaskService(mContext, apiURL, synchedJSONObjects).revPostJSON(new IRevAsyncJSONPostTask() {
                @Override
                public void processFinishAsyncJSONPostTask(JSONObject jsonObject) {
                    try {
                        JSONArray jArr = jsonObject.getJSONArray("filter");
                        for (int i = 0; i < jArr.length(); i++) {
                            int revResolveStatus = jArr.getJSONObject(i).getInt("_revResolveStatus");
                            long remoteRevEntityRelationshipId = jArr.getJSONObject(i).getLong("_remoteRevEntityRelationshipId");

                            if (revResolveStatus != -1)
                                revPersLibUpdate.revPersUpdateSetRelResStatus_By_RemoteRelId(remoteRevEntityRelationshipId, revResolveStatus);
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                    if (i_rev_process_finish != null) i_rev_process_finish.REV_PROCESS_FINISH(null);
                }
            });
        }
    }

    private JSONObject syncObjs() {
        List<Long> remoteRelIds = revPersLibRead.revPersGetALLRevRels_RemoteRelId_By_ResolveStatus_RemoteTargetGUID(1, REV_SESSION_SETTINGS.getRevLoggedInRemoteEntityGuid());

        if (remoteRelIds == null || remoteRelIds.isEmpty()) return null;

        JSONObject jsonObject = new JSONObject();
        JSONArray array = new JSONArray();

        try {
            jsonObject.put("filter", array);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        for (Long remoteRelId : remoteRelIds) {
            try {
                array.put(
                        new JSONObject()
                                .put("_revResolveStatus", 1)
                                .put("_remoteRevEntityRelationshipId", remoteRelId)
                );
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        return jsonObject;
    }
}
