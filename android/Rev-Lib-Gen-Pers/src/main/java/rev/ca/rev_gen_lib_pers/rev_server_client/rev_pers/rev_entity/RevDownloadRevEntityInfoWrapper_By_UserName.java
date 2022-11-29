package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_entity;

import android.content.Context;
import android.util.Log;

import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityRelationship;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.rev_server_client.RevJSONEntityClassConstructor;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server.IRevAsyncJSONResponse;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server.RevAsyncGetJSONResponseTaskService;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;
import rev.ca.rev_gen_lib_pers.rev_varags_data.RevVarArgsData;
import rev.ca.rev_lib_gen_functions.RevLangStrings;

public class RevDownloadRevEntityInfoWrapper_By_UserName {

    public interface IRevDownloadRevEntityInfoWrapper {
        void revProcessFinish(RevVarArgsData revVarArgsData);
    }

    Map<Long, RevEntity> revConnectionEntities = new HashMap<>();

    public RevDownloadRevEntityInfoWrapper_By_UserName(final Context mContext, String revUsername, final IRevDownloadRevEntityInfoWrapper delegate) {
        String apiURL = REV_SESSION_SETTINGS.getRevRemoteServer() + "/rev_api/get_full_rev_user_entity_by_username/" + revUsername;

        new RevAsyncGetJSONResponseTaskService(mContext, apiURL, new IRevAsyncJSONResponse() {
            @Override
            public void processFinishAsyncJSONResponse(JSONObject jsonObject) {
                Log.v(RevLangStrings.REV_TAG, "RevAsyncGetJSONResponseTaskService");

                if (jsonObject != null) {
                    if (!REV_SESSION_SETTINGS.isIsNotLoggedIn()) {
                        RevEntity revLoggedInEntity = new RevPersLibRead().revPersGetRevEntityByGUID(REV_SESSION_SETTINGS.getRevLoggedInEntityGuid());
                        revConnectionEntities.put(REV_SESSION_SETTINGS.getRevLoggedInEntityGuid(), revLoggedInEntity);
                    }

                    RevJSONEntityClassConstructor revJSONEntityClassConstructor = new RevJSONEntityClassConstructor();
                    RevPersEntityInfoWrapperModel revPersEntityInfoWrapperModel = new RevPersEntityInfoWrapperModel();

                    try {
                        RevEntity revEntity = revJSONEntityClassConstructor.getClassRevEntity_From_JSON(jsonObject.getJSONObject("revEntity"));

                        RevEntity revEntitySocialInfo = revJSONEntityClassConstructor.getClassRevEntity_From_JSON(jsonObject.getJSONObject("revEntitySocialInfo"));
                        revEntity.set_revSocialInfoEntity(revEntitySocialInfo);

                        revPersEntityInfoWrapperModel.setRevEntity(revEntity);

                        /** REV CONTAINERS **/

                        JSONArray revEntityContainersJSONArray = jsonObject.getJSONArray("revEntityPublishersArr");

                        for (int i = 0; i < revEntityContainersJSONArray.length(); i++) {
                            JSONObject revContainerEntityJSON = revEntityContainersJSONArray.getJSONObject(i);
                            Iterator<String> keys = revContainerEntityJSON.keys();

                            while (keys.hasNext()) {
                                String revContainerEntityGUIDKey = keys.next();
                                JSONObject revContainerItemJSON = revContainerEntityJSON.getJSONObject(revContainerEntityGUIDKey);

                                if (revContainerItemJSON instanceof JSONObject) {
                                    RevEntity revContainerEntity = new RevJSONEntityClassConstructor().getClassRevEntity_From_JSON(revContainerItemJSON);
                                    revPersEntityInfoWrapperModel.getRevEntityContainers().add(revContainerEntity);
                                }
                            }
                        }

                        /** END REV CONTAINERS **/

                        JSONArray revEntityConnectionsJSONArray = jsonObject.getJSONArray("revEntityConnections");

                        for (int i = 0; i < revEntityConnectionsJSONArray.length(); i++) {
                            JSONObject revConnectionJSON = revEntityConnectionsJSONArray.getJSONObject(i);
                            Iterator<String> keys = revConnectionJSON.keys();

                            while (keys.hasNext()) {
                                String revOwnerEntityGUIDKey = keys.next();
                                JSONObject revConnectionItemJSON = revConnectionJSON.getJSONObject(revOwnerEntityGUIDKey);

                                if (revConnectionItemJSON.get("revConnectionEntity") instanceof JSONObject) {
                                    JSONObject revConnectionEntityJSON = revConnectionItemJSON.getJSONObject("revConnectionEntity");
                                    RevEntity revConnectionEntity = revJSONEntityClassConstructor.getClassRevEntity_From_JSON(revConnectionEntityJSON);

                                    revConnectionEntities.put(Long.valueOf(revOwnerEntityGUIDKey), revConnectionEntity);
                                    revPersEntityInfoWrapperModel.getRevEntityConnections().add(revConnectionEntity);
                                }
                            }
                        }

                        JSONArray revTimelineEntitiesJSONArray = jsonObject.getJSONArray("revTimelineEntities");
                        for (int i = 0; i < revTimelineEntitiesJSONArray.length(); i++) {
                            JSONObject revTimelineEntityJSON = revTimelineEntitiesJSONArray.getJSONObject(i);
                            RevEntity revTimelineEntity = new RevJSONEntityClassConstructor(revConnectionEntities.get(revTimelineEntityJSON.getLong("_revEntityOwnerGUID"))).getClassRevEntity_From_JSON(revTimelineEntityJSON);
                            revPersEntityInfoWrapperModel.getRevTimelineEntities().add(revTimelineEntity);
                        }

                        /** REV CONTAINERS **/

                        JSONArray revEntitySubscriptionEntitiesJSONArray = jsonObject.getJSONArray("revEntitySubscriptionEntitiesArr");

                        for (int i = 0; i < revEntitySubscriptionEntitiesJSONArray.length(); i++) {
                            JSONObject revContainerEntityJSON = revEntitySubscriptionEntitiesJSONArray.getJSONObject(i);
                            revPersEntityInfoWrapperModel.getRevEntitySubscriptionsList().add(new RevJSONEntityClassConstructor().getClassRevEntity_From_JSON(revContainerEntityJSON));
                        }

                        /** END REV CONTAINERS **/


                        /** GET REV RELS **/
                        JSONArray revConnRelsJSONArray = jsonObject.getJSONArray("revConnectionRels");

                        for (int i = 0; i < revConnRelsJSONArray.length(); i++) {
                            JSONObject revConnRel = revConnRelsJSONArray.getJSONObject(i);

                            RevEntityRelationship revEntityRelationship = new Gson().fromJson(revConnRel.toString(), RevEntityRelationship.class);
                            revPersEntityInfoWrapperModel.getRevEntityRelationshipList().add(revEntityRelationship);
                        }

                        RevVarArgsData revVarArgsData = new RevVarArgsData(mContext);
                        revVarArgsData.setRevEntity(revEntity);
                        revVarArgsData.setRevPersEntityInfoWrapperModel(revPersEntityInfoWrapperModel);

                        delegate.revProcessFinish(revVarArgsData);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        }).execute();
    }
}
