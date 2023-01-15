package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_data.rev_entity_rel;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibUpdate;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;

public class RevPersUpdateRevServerRelResolveStatus extends AsyncTask<Void, Void, Void> {

    private Context mContext;
    private JSONObject jsonObject;

    private RevPersLibUpdate revPersLibUpdate = new RevPersLibUpdate();

    public RevPersUpdateRevServerRelResolveStatus(Context mContext, JSONObject jsonObject) {
        this.mContext = mContext;
        this.jsonObject = jsonObject;
    }

    @Override
    protected Void doInBackground(Void... voids) {
        syncNewRevEntittyRelationships(jsonObject);
        return null;
    }

    private void syncNewRevEntittyRelationships(JSONObject jsonObject) {
        final RequestQueue queue = Volley.newRequestQueue(mContext);
        String postURL = REV_SESSION_SETTINGS.getRevRemoteServer() + "/rev_api/confirm_local_rel_save";

        JsonObjectRequest jobReq = new JsonObjectRequest(Request.Method.POST, postURL, jsonObject,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject jsonObject) {
                        JSONArray jArr;
                        try {
                            jArr = jsonObject.getJSONArray("filter");

                            for (int i = 0; i < jArr.length(); i++) {
                                JSONObject revRelJSON = jArr.getJSONObject(i);
                                try {
                                    long revEntityRelationshipRemoteId = revRelJSON.getLong("_remoteRevEntityRelationshipId");
                                    int revEntityRelResStatus = revRelJSON.getInt("_revResolveStatus");

                                    if (revEntityRelationshipRemoteId > 0) {
                                        revPersLibUpdate.revPersUpdateSetRelResStatus_By_RemoteRelId(revEntityRelationshipRemoteId, revEntityRelResStatus);
                                    }
                                } catch (JSONException e1) {
                                    e1.printStackTrace();
                                }
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError volleyError) {
                        Log.v("MyApp", "RevPersUpdateRevServerRelResolveStatus ERR >>>");
                    }
                });

        queue.add(jobReq);
    }
}
