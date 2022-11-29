package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_entity;

import android.content.Context;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_data.rev_entity_rel.RevPersUpdateRevServerRelResolveStatus;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_data.rev_entity_rel.RevPersUploadAcceptedRels;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server.ReadAllTargetedRevEntitiesJSON;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;

public class RevPersDownloadRequestingRevEntityRels_By_RemoteRevEntityTargetGUID {

    private Context mContext;

    public RevPersDownloadRequestingRevEntityRels_By_RemoteRevEntityTargetGUID(Context mContext) {
        this.mContext = mContext;
    }

    public void revPersReadRevEntityRelsTargetEntities_By_RemoteRevEntityGUID(long remoteRevEntityTargetGUID) {
        String allRevEntitiesApiURL = REV_SESSION_SETTINGS.getRevRemoteServer() + "/rev_api/rev_pers_read_revEntityRels_subjects_by_targetRevEntityGUID_Serv?remoteRevEntityTargetGUID=" + remoteRevEntityTargetGUID;

        new ReadAllTargetedRevEntitiesJSON(mContext, allRevEntitiesApiURL, new ReadAllTargetedRevEntitiesJSON.IRevGetRevJSONObjectsListAsync() {
            @Override
            public void processFinishIRevGetJSONObjectsList(List<Long> revRemoteRelIdList) {
                if (revRemoteRelIdList.size() > 0) {
                    JSONObject jsonObject = new JSONObject();
                    JSONArray array = new JSONArray();

                    for (int i = 0; i < revRemoteRelIdList.size(); i++) {
                        Long revRemoteRelId = revRemoteRelIdList.get(i);
                        JSONObject revRelJSONObj = new JSONObject();
                        try {
                            revRelJSONObj.put(
                                    "_remoteRevEntityRelationshipId", revRemoteRelId
                            ).put(
                                    "_revResolveStatus", 2
                            );
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        array.put(revRelJSONObj);
                    }

                    try {
                        jsonObject.put("filter", array);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                    new RevPersUpdateRevServerRelResolveStatus(mContext, jsonObject).execute();
                    new RevPersUploadAcceptedRels(mContext);
                }
            }
        });
    }
}
