package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server;

import org.json.JSONObject;

public interface IRevAsyncJSONResponse {
    void processFinishAsyncJSONResponse(JSONObject jsonObject);
}
