package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_pers_file;

import android.util.Log;

import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.RequestParams;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import cz.msebera.android.httpclient.Header;
import rev.ca.rev_gen_lib_pers.RevDBModels.REV_PERS_REVMETADATA_GEN_FUNCTIONS;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibUpdate;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;
import rev.ca.rev_lib_gen_functions.I_REV_PROCESS_FINISH;
import rev.ca.rev_lib_gen_functions.RevLangStrings;

public class RevFileUploaderAsyncHttpClient {

    private I_REV_PROCESS_FINISH i_rev_process_finish;

    private RevPersLibRead revPersLibRead = new RevPersLibRead();
    private RevPersLibUpdate revPersLibUpdate = new RevPersLibUpdate();

    private List<Long> revEntityFileGUIDs;
    private Map<String, Long> stringLongHashMap = new HashMap<>();

    public static final String HTTP_LOCALHOST_8081_FILE_UPLOAD = REV_SESSION_SETTINGS.getRevRemoteServer() + "/file_upload";

    public RevFileUploaderAsyncHttpClient(List<Long> revEntityFileGUIDs, I_REV_PROCESS_FINISH i_rev_process_finish) {
        this.revEntityFileGUIDs = revEntityFileGUIDs;
        this.i_rev_process_finish = i_rev_process_finish;

        this.upload();
    }

    private void upload() {
        AsyncHttpClient asyncHttpClient = new AsyncHttpClient();
        RequestParams requestParams = prepareRequestParams();

        String postURL = REV_SESSION_SETTINGS.getRevRemoteServer() + "/file_upload";

        Log.v(RevLangStrings.REV_TAG, "requestParams : " + requestParams.toString());

        asyncHttpClient.post(postURL, requestParams, new JsonHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject jsonObject) {
                if (jsonObject == null) return;

                try {
                    JSONArray jArr = jsonObject.getJSONArray("filter");

                    Log.v(RevLangStrings.REV_TAG, "jArr :>>>\n\t" + jArr);

                    for (int i = 0; i < jArr.length(); i++) {
                        String filename = jArr.getString(i);
                        if (stringLongHashMap.containsKey(filename)) {
                            long revFileEntityGUID = stringLongHashMap.get(filename);

                            Log.v(RevLangStrings.REV_TAG, "jArr filename :>>>" + filename + "  revFileEntityGUID : " + revFileEntityGUID);

                            revPersLibUpdate.setRevEntityResolveStatusByRevEntityGUID(7, revFileEntityGUID);

                            List<Long> longList = new RevPersLibRead().revPersGetALLRevEntityGUIDs_By_ResStatus(-77);

                            if (!longList.isEmpty()) {
                                new RevFileUploaderAsyncHttpClient(longList, new I_REV_PROCESS_FINISH() {
                                    @Override
                                    public void REV_PROCESS_FINISH(Object o) {
                                    }
                                });
                            }
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, String res, Throwable t) {
                // called when response HTTP status is "4XX" (eg. 401, 403, 404)
            }
        });

        i_rev_process_finish.REV_PROCESS_FINISH(null);
    }

    private RequestParams prepareRequestParams() {
        RequestParams requestParams = new RequestParams();

        for (int i = 0; i < revEntityFileGUIDs.size(); i++) {
            Long aLong = revEntityFileGUIDs.get(i);

            List<RevEntityMetadata> revEntityMetadataList = revPersLibRead.revPersGetALLRevEntityMetadataByRevEntityGUID(aLong);

            if (revEntityMetadataList == null || revEntityMetadataList.isEmpty()) continue;

            String filePath = REV_PERS_REVMETADATA_GEN_FUNCTIONS.REV_GET_METADATA_VALUE(revEntityMetadataList, "rev_file_path_value");
            String fileName = REV_PERS_REVMETADATA_GEN_FUNCTIONS.REV_GET_METADATA_VALUE(revEntityMetadataList, "rev_remote_file_name");

            InputStream inputStream = null;
            try {
                inputStream = new FileInputStream(filePath);
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }

            revPersLibUpdate.setRevEntityResolveStatusByRevEntityGUID(-77, aLong);
            stringLongHashMap.put(fileName, aLong);

            requestParams.put(filePath, inputStream, fileName);
        }

        return requestParams;
    }
}
