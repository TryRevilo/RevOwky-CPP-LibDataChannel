package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_data.rev_entity_rel;

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
import rev.ca.rev_lib_gen_functions.I_REV_PROCESS_FINISH;

public class RevDownloadRemoteRelIds_By_Subject_Target_RelId {

    private String apiURL = REV_SESSION_SETTINGS.getRevRemoteServer() + "/rev_api/rev_rel_id_by_subject_target_rel_val_id";

    private RevPersLibRead revPersLibRead = new RevPersLibRead();
    private RevPersLibUpdate revPersLibUpdate = new RevPersLibUpdate();

    public RevDownloadRemoteRelIds_By_Subject_Target_RelId(Context mContext, I_REV_PROCESS_FINISH i_rev_process_finish) {
        JSONObject jsonObject = this.syncObjs(revPersLibRead.revPersGetRevEntityRels_By_ResStatus(-809));

        if (jsonObject != null) {
            new RevAsyncJSONPostTaskService(mContext, apiURL, jsonObject).revPostJSON(new IRevAsyncJSONPostTask() {
                @Override
                public void processFinishAsyncJSONPostTask(JSONObject jsonObject) {
                    try {
                        JSONArray jsonArray = jsonObject.getJSONArray("filter");

                        for (int i = 0; i < jsonArray.length(); i++) {
                            JSONObject object = jsonArray.getJSONObject(i);
                            long _revEntityRelationshipId = object.getLong("_revEntityRelationshipId");
                            long _remoteRevEntityRelationshipId = object.getLong("_remoteRevEntityRelationshipId");

                            if (_revEntityRelationshipId > 0 && _remoteRevEntityRelationshipId > 0) {
                                int revUpdateStatus = revPersLibUpdate.revPersSetRemoteRelationshipRemoteId(_revEntityRelationshipId, _remoteRevEntityRelationshipId);
                                if (revUpdateStatus == 1) {
                                    revPersLibUpdate.revPersUpdateRelResStatus_By_RemoteRelId(_revEntityRelationshipId, 0);
                                }
                            } else
                                revPersLibUpdate.revPersUpdateRelResStatus_By_RemoteRelId(_revEntityRelationshipId, -3);
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });
        } else i_rev_process_finish.REV_PROCESS_FINISH(null);
    }

    private JSONObject syncObjs(List<RevEntityRelationship> revEntityRelationshipList) {
        if (revEntityRelationshipList.isEmpty()) return null;

        JSONObject jsonObject = new JSONObject();
        JSONArray array = new JSONArray();

        for (RevEntityRelationship revEntityRelationship : revEntityRelationshipList) {
            long _revEntityRelationshipTypeValueId = revEntityRelationship.get_revEntityRelationshipTypeValueId();
            long _remoteRevEntitySubjectGUID = revEntityRelationship.get_remoteRevEntitySubjectGUID();
            long _remoteRevEntityTargetGUID = revEntityRelationship.get_remoteRevEntityTargetGUID();

            if (_revEntityRelationshipTypeValueId < 0 || _remoteRevEntitySubjectGUID < 0 || _remoteRevEntityTargetGUID < 0) {
                revPersLibUpdate.revPersUpdateRelResStatus_By_RemoteRelId(revEntityRelationship.get_revEntityRelationshipId(), -3);
                continue;
            }

            int revUpdateStatus = revPersLibUpdate.revPersUpdateRelResStatus_By_RelId(revEntityRelationship.get_revEntityRelationshipId(), -810);

            if (revUpdateStatus == 1) {
                try {
                    array.put(
                            new JSONObject()
                                    .put("_revEntityRelationshipId", revEntityRelationship.get_revEntityRelationshipId())
                                    .put("_revEntityRelationshipTypeValueId", _revEntityRelationshipTypeValueId)
                                    .put("_remoteRevEntitySubjectGUID", _remoteRevEntitySubjectGUID)
                                    .put("_remoteRevEntityTargetGUID", _remoteRevEntityTargetGUID)
                    );
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }

        try {
            jsonObject.put("filter", array);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return jsonObject;
    }

}
