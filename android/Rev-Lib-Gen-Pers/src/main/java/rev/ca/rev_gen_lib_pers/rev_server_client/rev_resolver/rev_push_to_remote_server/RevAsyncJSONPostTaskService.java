package rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server;

import android.content.Context;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONObject;

public class RevAsyncJSONPostTaskService {

    private Context mContext;
    private String apiURL;
    private JSONObject jsonObject;

    public RevAsyncJSONPostTaskService(Context hostContext, String apiURL, JSONObject jsonObject) {
        this.mContext = hostContext;
        this.apiURL = apiURL;
        this.jsonObject = jsonObject;
    }

    public void revPostJSON(final IRevAsyncJSONPostTask callback) {
        final RequestQueue queue = Volley.newRequestQueue(mContext);

        JsonObjectRequest jobReq = new JsonObjectRequest(Request.Method.POST, apiURL, jsonObject,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject jsonObject) {
                        callback.processFinishAsyncJSONPostTask(jsonObject);
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError volleyError) {
                        Log.v("MyApp", "RevAsyncJSONPostTaskService revPostJSON ERR >>>");
                    }
                });

        queue.add(jobReq);
    }
}
