package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_data.rev_data_services;

import android.content.Context;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.IRevAsyncJSONPostTask;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.RevAsyncJSONPostTaskService;
import rev.ca.rev_lib_gen_functions.RevLangStrings;
import rev.ca.rev_lib_gen_functions.RevLibGenConstantine;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;

public class RevRegCallbackIPOnRemoteServer {

    private Context mContext;

    public RevRegCallbackIPOnRemoteServer(Context mContext) {
        this.mContext = mContext;
    }

    public void revRegCallbackIPOnRemoteServer() {
        JSONObject jsonObject = new JSONObject();

        try {
            jsonObject.put("_remoteRevEntityGUID", REV_SESSION_SETTINGS.getRevLoggedInRemoteEntityGuid());
            jsonObject.put("revSocket", RevLibGenConstantine.REV_CONN_SOCKET);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        String apiURL = REV_SESSION_SETTINGS.getRevRemoteServer() + "/app/rev_reg_ip";
        new RevAsyncJSONPostTaskService(mContext, apiURL, jsonObject).revPostJSON(new IRevAsyncJSONPostTask() {
            @Override
            public void processFinishAsyncJSONPostTask(JSONObject jsonObject) {
                Log.v(RevLangStrings.REV_TAG, "Guns & Roses >>>> : " + jsonObject);
            }
        });
    }
}
