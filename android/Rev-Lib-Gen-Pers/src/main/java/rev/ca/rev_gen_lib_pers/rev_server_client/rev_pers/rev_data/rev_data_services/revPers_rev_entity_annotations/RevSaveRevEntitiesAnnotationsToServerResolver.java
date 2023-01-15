package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_data.rev_data_services.revPers_rev_entity_annotations;

import android.content.Context;

import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevAnnotation;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibUpdate;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.IRevAsyncJSONPostTask;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.RevAsyncJSONPostTaskService;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;

public class RevSaveRevEntitiesAnnotationsToServerResolver {

    private Context mContext;

    String postURL = REV_SESSION_SETTINGS.getRevRemoteServer() + "/rev_api/rev_post_rev_annotation";

    RevPersLibRead revPersLibRead = new RevPersLibRead();
    RevPersLibUpdate revPersLibUpdate = new RevPersLibUpdate();

    public RevSaveRevEntitiesAnnotationsToServerResolver(Context mContext) {
        this.mContext = mContext;
    }

    private JSONObject syncObjs() {
        List<Long> revAnnotationIdsList = revPersLibRead.getAllRevEntityAnnoationIds_By_ResStatus(-1);

        if (revAnnotationIdsList.size() > 0) {
            JSONObject jsonObject = new JSONObject();
            JSONArray array = new JSONArray();

            Gson gson = new Gson();

            for (long revAnnId : revAnnotationIdsList) {
                RevAnnotation revAnnotation = revPersLibRead.revPersGetRevEntityAnn_By_LocalAnnId(revAnnId);
                String json = gson.toJson(revAnnotation);

                try {
                    array.put(new JSONObject(json));
                    jsonObject.put("filter", array);

                    revPersLibUpdate.revPersSetRevAnnResStatus_By_RevAnnId(revAnnId, -101);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            return jsonObject;
        }

        return null;
    }

    public void syncNewRevEntitiesAnnotations() {
        JSONObject jsonObject = this.syncObjs();

        if (jsonObject != null) {
            new RevAsyncJSONPostTaskService(mContext, postURL, jsonObject).revPostJSON(new IRevAsyncJSONPostTask() {
                @Override
                public void processFinishAsyncJSONPostTask(JSONObject jsonObject) {
                    JSONArray jArr;
                    try {
                        jArr = jsonObject.getJSONArray("filter");
                        setRemoteRevEntityAnnotationId(jArr);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });
        }
    }

    private void setRemoteRevEntityAnnotationId(JSONArray jsonArray) {
        if (jsonArray.length() == 0) {
        } else {
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject e;
                try {
                    e = jsonArray.getJSONObject(i);
                    long revAnnotationId = Long.parseLong(e.getString("_revAnnotationId"));
                    long revAnnotationRemoteId = Long.parseLong(e.getString("_revAnnotationRemoteId"));

                    if (revAnnotationRemoteId < 1) {
                        revPersLibUpdate.revPersSetRevAnnResStatus_By_RevAnnId(revAnnotationId, -1);
                        continue;
                    }

                    revPersLibUpdate.revPersSetRevAnnResStatus_By_RevAnnId(revAnnotationId, 0);
                    revPersLibUpdate.revPersSetRemoteRevAnnId(revAnnotationId, revAnnotationRemoteId);
                } catch (JSONException e1) {
                    e1.printStackTrace();
                }
            }
        }
    }
}
