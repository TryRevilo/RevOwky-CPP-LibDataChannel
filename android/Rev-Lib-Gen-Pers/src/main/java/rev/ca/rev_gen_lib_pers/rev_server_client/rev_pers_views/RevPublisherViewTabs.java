package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers_views;

import android.content.Context;
import android.util.Log;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;
import java.util.List;

import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.IRevAsyncJSONPostTask;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.RevAsyncJSONPostTaskService;
import rev.ca.rev_lib_gen_functions.RevLangStrings;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;

public class RevPublisherViewTabs {

    private Context mContext;

    public RevPublisherViewTabs(Context mContext) {
        this.mContext = mContext;
    }

    public void deleteRevEntity() {
        
    }
}
