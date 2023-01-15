package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server;

import android.content.Context;
import android.os.AsyncTask;

import org.json.JSONObject;

public class RevAsyncGetJSONResponseTaskService extends AsyncTask<String, String, JSONObject> {

    private Context mContext;
    private String apiURL;
    private IRevAsyncJSONResponse delegate;

    public RevAsyncGetJSONResponseTaskService(Context hostContext, String apiURL, IRevAsyncJSONResponse iRevAsyncJSONResponse) {
        this.mContext = hostContext;
        this.apiURL = apiURL;
        this.delegate = iRevAsyncJSONResponse;
    }

    @Override
    protected JSONObject doInBackground(String... params) {
        // Method runs on a separate thread, make all the network calls you need
        return new RevAsyncJSONResponseTaskServiceProvider().revFetchJSONModules(mContext, apiURL);
    }

    @Override
    protected void onPostExecute(JSONObject result) {
        delegate.processFinishAsyncJSONResponse(result);
        // Runs on the UI thread
        // Do something with the result
    }
}
