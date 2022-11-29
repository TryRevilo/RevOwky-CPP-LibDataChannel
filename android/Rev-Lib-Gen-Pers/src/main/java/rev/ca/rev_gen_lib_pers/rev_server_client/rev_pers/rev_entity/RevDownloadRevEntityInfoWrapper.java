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
import rev.ca.rev_gen_lib_pers.rev_server_client.RevJSONEntityClassConstructor;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server.IRevAsyncJSONResponse;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server.RevAsyncGetJSONResponseTaskService;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;
import rev.ca.rev_gen_lib_pers.rev_varags_data.RevVarArgsData;
import rev.ca.rev_lib_gen_functions.I_REV_PROCESS_FINISH;
import rev.ca.rev_lib_gen_functions.RevLangStrings;

public class RevDownloadRevEntityInfoWrapper {

    public RevDownloadRevEntityInfoWrapper(final Context mContext, Long remoteRevEntityGUID, final I_REV_PROCESS_FINISH delegate) {
        String apiURL = REV_SESSION_SETTINGS.getRevRemoteServer() + "/rev_api/rev_get_entity_info_wrapper_by_remote_entity_GUID/" + remoteRevEntityGUID;

        new RevAsyncGetJSONResponseTaskService(mContext, apiURL, new IRevAsyncJSONResponse() {
            @Override
            public void processFinishAsyncJSONResponse(JSONObject jsonObject) {
                if (jsonObject != null) {
                    RevPersEntityInfoWrapperModel revPersEntityInfoWrapperModel = new RevPersEntityInfoWrapperModel();

                    Map<Long, RevEntity> revConnectionEntities = new HashMap<>();

                    if (!REV_SESSION_SETTINGS.isIsNotLoggedIn())
                        revConnectionEntities.put(REV_SESSION_SETTINGS.getRevLoggedInRemoteEntityGuid(), REV_SESSION_SETTINGS.getRevLoggedInPageRevVarArgsData().getRevEntity());

                    try {
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

                        /** REV PUBLISHERS **/

                        JSONArray revEntityPublishersContainerJSONArray = jsonObject.getJSONArray("revEntityPublishersArr");

                        for (int i = 0; i < revEntityPublishersContainerJSONArray.length(); i++) {
                            JSONObject revPublisherJSON = revEntityPublishersContainerJSONArray.getJSONObject(i);

                            Iterator<String> keys = revPublisherJSON.keys();

                            while (keys.hasNext()) {
                                String revPublisherEntityGUIDKey = keys.next();
                                JSONObject revPublisherItemJSON = revPublisherJSON.getJSONObject(revPublisherEntityGUIDKey);

                                if (revPublisherItemJSON instanceof JSONObject) {
                                    RevEntity revPublisherEntity = new RevJSONEntityClassConstructor().getClassRevEntity_From_JSON(revPublisherItemJSON);

                                    if (!revConnectionEntities.containsKey(Long.parseLong(revPublisherEntityGUIDKey)))
                                        revConnectionEntities.put(Long.valueOf(revPublisherEntityGUIDKey), revPublisherEntity);
                                }
                            }
                        }

                        /** END REV PUBLISHERS **/

                        RevJSONEntityClassConstructor revJSONEntityClassConstructor = new RevJSONEntityClassConstructor(revConnectionEntities);

                        RevEntity revEntity = revJSONEntityClassConstructor.getClassRevEntity_From_JSON(jsonObject.getJSONObject("revEntity"));

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

                        /** REV RELATED GROUP ENTITIES **/

                        if (!revEntity.get_revEntityType().equals("rev_group_entity")) {
                            JSONArray revEntitySubscriptionEntitiesJSONArray = jsonObject.getJSONArray("revEntitySubscriptionEntitiesArr");

                            for (int i = 0; i < revEntitySubscriptionEntitiesJSONArray.length(); i++) {
                                JSONObject revContainerEntityJSON = revEntitySubscriptionEntitiesJSONArray.getJSONObject(i);
                                Iterator<String> keys = revContainerEntityJSON.keys();

                                while (keys.hasNext()) {
                                    String revContainerEntityGUIDKey = keys.next();
                                    JSONObject revContainerItemJSON = revContainerEntityJSON.getJSONObject(revContainerEntityGUIDKey);

                                    if (revContainerItemJSON instanceof JSONObject) {
                                        RevEntity revContainerEntity = new RevJSONEntityClassConstructor().getClassRevEntity_From_JSON(revContainerItemJSON);
                                        revPersEntityInfoWrapperModel.getRevEntitySubscriptionsList().add(revContainerEntity);
                                    }
                                }
                            }
                        }

                        /** END RELATED GROUP ENTITIES **/

                        JSONArray revTimelineEntitiesJSONArray = jsonObject.getJSONArray("revTimelineEntities");

                        for (int i = 0; i < revTimelineEntitiesJSONArray.length(); i++) {
                            JSONObject revTimelineEntityJSON = revTimelineEntitiesJSONArray.getJSONObject(i);
                            RevEntity revTimelineEntity = new RevJSONEntityClassConstructor(revConnectionEntities).getClassRevEntity_From_JSON(revTimelineEntityJSON);
                            revPersEntityInfoWrapperModel.getRevTimelineEntities().add(revTimelineEntity);
                        }


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

                        delegate.REV_PROCESS_FINISH(revVarArgsData);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        }).execute();
    }
}
