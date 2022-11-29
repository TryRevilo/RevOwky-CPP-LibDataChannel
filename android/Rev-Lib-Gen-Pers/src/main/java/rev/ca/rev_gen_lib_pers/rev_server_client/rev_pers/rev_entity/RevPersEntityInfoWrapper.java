package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_entity;

import android.content.Context;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import rev.ca.rev_gen_lib_pers.rev_server_client.RevJSONEntityClassConstructor;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server.IRevAsyncJSONResponse;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server.RevAsyncGetJSONResponseTaskService;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;

public class RevPersEntityInfoWrapper {

    public interface IRevGetRemoteInfoWrapperAsyncJSONResponse {
        void processFinishAsyncJSONWrapperResponse(RevPersEntityInfoWrapperModel revPersEntityInfoWrapperModel);
    }

    private RevPersEntityInfoWrapperModel revPersEntityInfoWrapperModel = new RevPersEntityInfoWrapperModel();

    public RevPersEntityInfoWrapper(Context mContext, String revUserName, final IRevGetRemoteInfoWrapperAsyncJSONResponse iRevGetRemoteInfoWrapperAsyncJSONResponse) {
        String apiURL = REV_SESSION_SETTINGS.getRevRemoteServer() + "/rev_api/get_full_rev_user_entity_by_username?revUserEntityUniqueRep=" + revUserName;

        new RevAsyncGetJSONResponseTaskService(mContext, apiURL, new IRevAsyncJSONResponse() {
            @Override
            public void processFinishAsyncJSONResponse(JSONObject jsonObject) {
                if (jsonObject == null || jsonObject.length() == 0) {
                    return;
                } else {
                    RevJSONEntityClassConstructor revJSONEntityClassConstructor = new RevJSONEntityClassConstructor();

                    RevEntity revEntity = revJSONEntityClassConstructor.getClassRevEntity_From_JSON(jsonObject);
                    revPersEntityInfoWrapperModel.setRevEntity(revEntity);

                    try {
                        JSONArray revEntityChildrenListJSONArray = jsonObject.getJSONArray("_revEntityChildrenList");

                        for (int i = 0; i < revEntityChildrenListJSONArray.length(); i++) {
                            JSONObject revChildJSON = revEntityChildrenListJSONArray.getJSONObject(i);
                            String revEntitySubType = revChildJSON.getString("_revEntitySubType");

                            RevEntity revChildEntity = revJSONEntityClassConstructor.getClassRevEntity_From_JSON(revChildJSON);

                            if (revChildEntity == null) continue;

                            if (revEntitySubType.equals("rev_entity_info")) {
                                revPersEntityInfoWrapperModel.setRevInfoEntity(revChildEntity);
                            } else if (revEntitySubType.equals("rev_entity_social_info")) {
                                revPersEntityInfoWrapperModel.setRevEntitySocialInfo(revChildEntity);
                            } else if (revEntitySubType.equals("rev_pics_album")) {
                                revPersEntityInfoWrapperModel.setRevEntityPicsAlbum(revChildEntity);

                                JSONArray revPicsJSONArray = revChildJSON.getJSONArray("_revEntityChildrenList");

                                for (int pI = 0; pI < revPicsJSONArray.length(); pI++) {
                                    RevEntity revPicEntity = revJSONEntityClassConstructor.getClassRevEntity_From_JSON(revPicsJSONArray.getJSONObject(pI));
                                    revPersEntityInfoWrapperModel.getRevEntityPicsAlbum().get_revEntityChildrenList().add(revPicEntity);
                                }
                            }
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                    iRevGetRemoteInfoWrapperAsyncJSONResponse.processFinishAsyncJSONWrapperResponse(revPersEntityInfoWrapperModel);
                }

            }
        }).execute();
    }
}
