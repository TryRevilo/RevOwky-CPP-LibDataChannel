package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_data.rev_entity_rel;

import android.content.Context;
import android.os.AsyncTask;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import rev.ca.rev_gen_lib_pers.c_libs_core.rev_java_lib.rev_pre_pers.RevPrePersRevEntityRel;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server.IRevAsyncJSONResponse;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server.RevAsyncGetJSONResponseTaskService;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityRelationship;

public class RevPersDownloadNewRelTargetsAsync extends AsyncTask<Void, Void, Void> {

    public interface IRevPersDownloadNewRelTargetsAsync {
        void iRevAssertSavedRelRequests(List<Long> revRelIds);
    }

    private IRevPersDownloadNewRelTargetsAsync delegate;
    private Context mContext;
    private List<Long> revEntityRelIds = new ArrayList<>();

    public RevPersDownloadNewRelTargetsAsync(Context mContext, IRevPersDownloadNewRelTargetsAsync delegate) {
        this.mContext = mContext;
        this.delegate = delegate;
    }

    @Override
    protected Void doInBackground(Void... objects) {
        String apiURLRels = REV_SESSION_SETTINGS.getRevRemoteServer() + "/rev_api/getNewRevRelationshipsTargets?remoteRevEntityGUID=" + String.valueOf(REV_SESSION_SETTINGS.getRevLoggedInRemoteEntityGuid());

        /**
        new RevAsyncGetJSONResponseTaskService(mContext, apiURLRels, new IRevAsyncJSONResponse() {
            @Override
            public void processFinishAsyncJSONResponse(JSONObject jsonObject) {
                JSONArray jArr = null;

                if (jsonObject == null || jsonObject.length() == 0) return;

                try {
                    jArr = (JSONArray) jsonObject.get("filter");
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                for (int i = 0; i < jArr.length(); i++) {
                    JSONObject e;
                    try {
                        e = jArr.getJSONObject(i);

                        RevEntityRelationship revEntityRelationship = new RevEntityRelationship(
                                "rev_entity_connect_members",
                                e.getLong("SUBJECT_GUID"),
                                e.getLong("TARGET_GUID"));

                        revEntityRelationship.set_remoteRevEntityRelationshipId(e.getLong("RELATIONSHIP_ID"));
                        revEntityRelationship.set_revResolveStatus(-200);

                        Long revEntityRelId = new RevPrePersRevEntityRel().revPersRelationship(revEntityRelationship);

                        if (revEntityRelId > 0) revEntityRelIds.add(revEntityRelId);

                    } catch (JSONException e1) {
                        e1.printStackTrace();
                    }
                }
            }
        }).execute();
        **/

        return null;
    }

    @Override
    protected void onPostExecute(Void aVoid) {
        delegate.iRevAssertSavedRelRequests(this.revEntityRelIds);
    }
}
