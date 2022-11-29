package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_data.rev_entity_rel;

import android.content.Context;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibUpdate;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.IRevAsyncJSONPostTask;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.RevAsyncJSONPostTaskService;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;
import rev.ca.rev_lib_gen_functions.I_REV_PROCESS_FINISH;

public class RevSetRemoteRelResStatus_By_RemoteRelId {

    private RevPersLibUpdate revPersLibUpdate = new RevPersLibUpdate();
    private String apiURL = REV_SESSION_SETTINGS.getRevRemoteServer() + "/rev_api/rev_set_rel_res_status_by_rel_id";

    public RevSetRemoteRelResStatus_By_RemoteRelId(final Context mContext, int revResStatus, final List<Long> revRelIdsList, final I_REV_PROCESS_FINISH i_rev_process_finish) {
        if (syncObjs(revResStatus, revRelIdsList) != null) {
            new RevAsyncJSONPostTaskService(mContext, apiURL, syncObjs(revResStatus, revRelIdsList)).revPostJSON(new IRevAsyncJSONPostTask() {
                @Override
                public void processFinishAsyncJSONPostTask(JSONObject jsonObject) {
                    try {
                        JSONArray jArr = jsonObject.getJSONArray("filter");
                        for (int i = 0; i < jArr.length(); i++) {
                            int revResolveStatus = jArr.getJSONObject(i).getInt("_revResolveStatus");
                            long remoteRevEntityRelationshipId = jArr.getJSONObject(i).getLong("_remoteRevEntityRelationshipId");

                            if (revResolveStatus > 0)
                                revPersLibUpdate.revPersUpdateSetRelResStatus_By_RemoteRelId(remoteRevEntityRelationshipId, revResolveStatus);
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                    i_rev_process_finish.REV_PROCESS_FINISH(null);
                }
            });
        } else
            i_rev_process_finish.REV_PROCESS_FINISH(null);
    }

    private JSONObject syncObjs(int revResStatus, List<Long> remoteRelIds) {
        if (remoteRelIds == null || remoteRelIds.isEmpty()) return null;

        List<Long> longList = new ArrayList<>();

        for (long revRemoteRelId : remoteRelIds) {
            int revUpdateStatus = revPersLibUpdate.revPersUpdateRelResStatus_By_RemoteRelId(revRemoteRelId, -808);
            if (revUpdateStatus == 1) longList.add(revRemoteRelId);
        }

        JSONObject jsonObject = new JSONObject();
        JSONArray array = new JSONArray();

        try {
            jsonObject.put("filter", array);

            String revRelIdsString = longList.toString().replace("[", "").replace("]", "").replace(" ", "");

            array.put(
                    new JSONObject()
                            .put("_revResolveStatus", revResStatus)
                            .put("_remoteRevEntityRelationshipId", revRelIdsString)
            );
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return jsonObject;
    }
}
