package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_data.rev_entity_rel;

import android.content.Context;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibUpdate;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server.IRevAsyncJSONResponse;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server.RevAsyncGetJSONResponseTaskService;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;
import rev.ca.rev_lib_gen_functions.I_REV_PROCESS_FINISH;

public class RevDownloadRevEntityRels_By_ResStatus_SubjectGUID {

    private Context mContext;

    private RevPersLibUpdate revPersLibUpdate = new RevPersLibUpdate();

    public RevDownloadRevEntityRels_By_ResStatus_SubjectGUID(Context mContext) {
        this.mContext = mContext;
    }

    public void revDownloadRevEntityRels_By_ResStatus_SubjectGUID(int resStatus, long revSubjectGUID) {
        String getAllRevEntities_By_OwnerGUIDs_apiURL = REV_SESSION_SETTINGS.getRevRemoteServer()
                + "/rev_api/get_rev_rel_ids_by_res_status_subject_GUID?rev_res_status=" + resStatus + "&rev_subject_guid=" + revSubjectGUID;

        new RevAsyncGetJSONResponseTaskService(mContext, getAllRevEntities_By_OwnerGUIDs_apiURL, new IRevAsyncJSONResponse() {
            @Override
            public void processFinishAsyncJSONResponse(JSONObject jsonObject) {
                if (jsonObject == null) return;

                JSONArray jArr;
                List<Long> revRelIds = new ArrayList<>();

                try {
                    jArr = jsonObject.getJSONArray("filter");

                    for (int i = 0; i < jArr.length(); i++) {
                        try {
                            long revRemoteRelId = jArr.getLong(i);
                            int revUpdateStatus = revPersLibUpdate.revPersUpdateSetRelResStatus_By_RemoteRelId(revRemoteRelId, 0);

                            if (revUpdateStatus == 1) revRelIds.add(revRemoteRelId);
                        } catch (JSONException e1) {
                            e1.printStackTrace();
                        }
                    }

                } catch (JSONException e) {
                    e.printStackTrace();
                }

                new RevSetRemoteRelResStatus_By_RemoteRelId(mContext, 0, revRelIds, new I_REV_PROCESS_FINISH() {
                    @Override
                    public void REV_PROCESS_FINISH(Object o) {

                    }
                });
            }
        }).execute();
    }
}
