package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server;

import android.content.Context;
import android.util.Log;

import com.android.volley.RequestQueue;
import com.android.volley.RetryPolicy;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.RequestFuture;
import com.android.volley.toolbox.Volley;

import org.json.JSONObject;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import rev.ca.rev_lib_gen_functions.RevLangStrings;

public class RevAsyncJSONResponseTaskServiceProvider {

    public JSONObject revFetchJSONModules(Context ctx, String apiURL) {
        JSONObject revJSONResponse = null;
        RequestQueue requestQueue = Volley.newRequestQueue(ctx);

        RequestFuture<JSONObject> future = RequestFuture.newFuture();
        JsonObjectRequest request = new JsonObjectRequest(apiURL, null, future, future);
        requestQueue.add(request);

        request.setRetryPolicy(new RetryPolicy() {
            @Override
            public int getCurrentTimeout() {
                return 50000;
            }

            @Override
            public int getCurrentRetryCount() {
                return 50000;
            }

            @Override
            public void retry(VolleyError error) throws VolleyError {

            }
        });

        try {
            revJSONResponse = future.get(10, TimeUnit.SECONDS); // Blocks for at most 10 seconds.
        } catch (InterruptedException e) {
            Log.v(RevLangStrings.REV_TAG, apiURL + "\n\t\t>>>>>>>>>>> InterruptedException >>>>\n\t\t" + e.getMessage());
        } catch (ExecutionException e) {
            Log.v(RevLangStrings.REV_TAG, apiURL + "\n\t\t>>>>>>>>>>> ExecutionException >>>>\n\t\t" + e.getMessage());
        } catch (TimeoutException e) {
            Log.v(RevLangStrings.REV_TAG, apiURL + "\n\t\t>>>>>>>>>>> TimeoutException >>>>\n\t\t" + e.getMessage());
            e.printStackTrace();
        }

        return revJSONResponse;
    }
}
