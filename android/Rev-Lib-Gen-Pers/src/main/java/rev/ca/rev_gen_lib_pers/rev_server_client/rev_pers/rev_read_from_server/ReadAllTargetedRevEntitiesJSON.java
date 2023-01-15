package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server;

import android.content.Context;

import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibUpdate;
import rev.ca.rev_gen_lib_pers.c_libs_core.rev_java_lib.RevPersJava;
import rev.ca.rev_gen_lib_pers.rev_server_client.RevJSONEntityClassConstructor;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityRelationship;

/**
 * Save all entities we had requested to be connected with via RemoteRevEntityGUID
 * We get the a JSON array containing the Relationship  and the targeted RevEntity
 *
 * var revRetArrDef = {
 *    filter: [
 *      {{revRel}, {revRelFilledEntity}}
 *    ]
 *  };
 */

public class ReadAllTargetedRevEntitiesJSON {

    private RevPersJava revPersJava = new RevPersJava();
    private RevPersLibRead revPersLibRead = new RevPersLibRead();

    public interface IRevGetRevJSONObjectsListAsync {
        void processFinishIRevGetJSONObjectsList(List<Long> _revRemoteRelIdList);
    }

    private List<Long> revRemoteRelIdList;

    public ReadAllTargetedRevEntitiesJSON(Context mContext, String apiURL, final IRevGetRevJSONObjectsListAsync delegate) {
        revRemoteRelIdList = new ArrayList<>();

        new RevAsyncGetJSONResponseTaskService(mContext, apiURL, new IRevAsyncJSONResponse() {
            @Override
            public void processFinishAsyncJSONResponse(JSONObject jsonObject) {
                if (jsonObject == null) return;

                JSONArray jArr = null;
                try {
                    jArr = jsonObject.getJSONArray("filter");
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                RevJSONEntityClassConstructor revJSONEntityClassConstructor = new RevJSONEntityClassConstructor();
                Gson gson = new Gson();

                for (int i = 0; i < jArr.length(); i++) {
                    JSONObject e;
                    try {
                        e = jArr.getJSONObject(i);
                        JSONObject revJSONRel = e.getJSONObject("revRel");
                        RevEntityRelationship revEntityRelationship = gson.fromJson(revJSONRel.toString(), RevEntityRelationship.class);

                        JSONObject revEntityJSON = e.getJSONObject("revEntity");
                        RevEntity revEntity = revJSONEntityClassConstructor.getClassRevEntity_From_JSON(revEntityJSON);

                        long revRemoteSubjectEntityGUID = revEntity.get_remoteRevEntityGUID();
                        long revLocalSubjectEntityGUID;

                        if (revPersLibRead.revEntityExistsByRemoteEntityGUID(revRemoteSubjectEntityGUID) == -1) {
                            revEntity.set_revEntityResolveStatus(0);
                            revLocalSubjectEntityGUID = (long) revPersJava.saveRevEntity_NO_REMOTE_SYNC(revEntity);
                        } else {
                            revLocalSubjectEntityGUID = revPersLibRead.getLocalRevEntityGUID_By_RemoteRevEntityGUID(revRemoteSubjectEntityGUID);
                        }

                        if (revLocalSubjectEntityGUID > 0) {
                            revEntityRelationship.set_revResolveStatus(-200);
                            revEntityRelationship.set_revEntitySubjectGUID(revLocalSubjectEntityGUID);
                            revEntityRelationship.set_remoteRevEntitySubjectGUID(revRemoteSubjectEntityGUID);
                            revEntityRelationship.set_revEntityTargetGUID(REV_SESSION_SETTINGS.getRevLoggedInEntityGuid());
                            revEntityRelationship.set_remoteRevEntityTargetGUID(REV_SESSION_SETTINGS.getRevLoggedInRemoteEntityGuid());

                            long revRelId = (long) revPersJava.saveRevEntity_NO_REMOTE_SYNC(revEntityRelationship);
                            new RevPersLibUpdate().revPersSetRemoteRelationshipRemoteId(revRelId, revEntityRelationship.get_remoteRevEntityRelationshipId());

                            revRemoteRelIdList.add(revEntityRelationship.get_remoteRevEntityRelationshipId());
                        }
                    } catch (JSONException e1) {
                        e1.printStackTrace();
                    }
                }

                delegate.processFinishIRevGetJSONObjectsList(revRemoteRelIdList);
            }


        }).execute();
    }
}
