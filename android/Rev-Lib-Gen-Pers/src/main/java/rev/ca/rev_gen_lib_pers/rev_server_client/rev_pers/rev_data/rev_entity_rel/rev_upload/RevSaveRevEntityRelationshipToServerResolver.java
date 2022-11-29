package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_data.rev_entity_rel.rev_upload;

import android.content.Context;
import android.os.AsyncTask;

import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityRelationship;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibDelete;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibUpdate;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.IRevAsyncJSONPostTask;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_resolver.rev_push_to_remote_server.RevAsyncJSONPostTaskService;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;

public class RevSaveRevEntityRelationshipToServerResolver extends AsyncTask<Void, Void, Void> {

    public interface IRevSaveRevEntityRelationshipToServerResolver {
        void revProcesFinish();
    }

    private Context mContext;
    private IRevSaveRevEntityRelationshipToServerResolver delegate;

    private RevPersLibRead revPersLibRead = new RevPersLibRead();
    private RevPersLibUpdate revPersLibUpdate = new RevPersLibUpdate();

    public RevSaveRevEntityRelationshipToServerResolver(Context mContext, IRevSaveRevEntityRelationshipToServerResolver delegate) {
        this.mContext = mContext;
        this.delegate = delegate;
    }

    public RevSaveRevEntityRelationshipToServerResolver(Context mContext) {
        this.mContext = mContext;
    }

    @Override
    protected Void doInBackground(Void... voids) {
        List<RevEntityRelationship> revEntityRelationshipList = revPersLibRead.revPersGetRevEntityRels_By_ResStatus(-1);

        if (revEntityRelationshipList != null && revEntityRelationshipList.size() > 0) {
            syncRevEntittyRelationships(revEntityRelationshipList);
        }

        return null;
    }

    @Override
    protected void onPostExecute(Void aVoid) {
        if (revPersLibRead.revPersGetRevEntityRels_By_ResStatus(-1).size() > 0) {
            new RevSaveRevEntityRelationshipToServerResolver(mContext).execute();
        } else if (delegate != null) delegate.revProcesFinish();
    }

    private void syncRevEntittyRelationships(List<RevEntityRelationship> revEntityRelationshipList) {
        JSONObject jsonObject = new JSONObject();
        JSONArray array = new JSONArray();

        for (int i = 0; i < revEntityRelationshipList.size(); i++) {
            RevEntityRelationship revEntityRelationship = revEntityRelationshipList.get(i);

            Long remoteSubjectGUID = revEntityRelationship.get_remoteRevEntitySubjectGUID();
            if (remoteSubjectGUID < 1) {
                remoteSubjectGUID = revPersLibRead.getRemoteRevEntityGUID(revEntityRelationship.get_revEntitySubjectGUID());
                if (remoteSubjectGUID < 1) {
                    revPersLibUpdate.revPersUpdateRelResStatus_By_RelId(revEntityRelationship.get_revEntityRelationshipId(), -107);
                    continue;
                }

                revPersLibUpdate.revPersUpdateSetRemoteSubjectGUID(revEntityRelationship.get_revEntitySubjectGUID(), remoteSubjectGUID);
                revEntityRelationship.set_remoteRevEntitySubjectGUID(remoteSubjectGUID);
            }

            Long remoteTargetGUID = revEntityRelationship.get_remoteRevEntityTargetGUID();
            if (remoteTargetGUID < 1) {
                remoteTargetGUID = revPersLibRead.getRemoteRevEntityGUID(revEntityRelationship.get_revEntityTargetGUID());
                if (remoteTargetGUID < 1) {
                    revPersLibUpdate.revPersUpdateRelResStatus_By_RelId(revEntityRelationship.get_revEntityRelationshipId(), -107);
                    continue;
                }

                revPersLibUpdate.revPersUpdateSetRemoteTargetGUID(revEntityRelationship.get_revEntityTargetGUID(), remoteTargetGUID);
                revEntityRelationship.set_remoteRevEntityTargetGUID(remoteTargetGUID);
            }

            if ((revEntityRelationship.get_revEntitySubjectGUID() < 1) && (revEntityRelationship.get_remoteRevEntitySubjectGUID() < 1))
                new RevPersLibDelete().deleteRevRel_By_Unset_Subject_Target_GUID(revEntityRelationship.get_revEntitySubjectGUID(), revEntityRelationship.get_remoteRevEntitySubjectGUID());

            if ((revEntityRelationship.get_revEntityTargetGUID() < 1) && (revEntityRelationship.get_remoteRevEntityTargetGUID() < 1))
                new RevPersLibDelete().deleteRevRel_By_Unset_Subject_Target_GUID(revEntityRelationship.get_revEntityTargetGUID(), revEntityRelationship.get_remoteRevEntityTargetGUID());

            if (revEntityRelationship.get_remoteRevEntitySubjectGUID() < 1 || revEntityRelationship.get_remoteRevEntityTargetGUID() < 1)
                continue;

            revPersLibUpdate.revPersUpdateRelResStatus_By_RelId(revEntityRelationship.get_revEntityRelationshipId(), -101);

            String json = new Gson().toJson(revEntityRelationship);

            try {
                array.put(new JSONObject(json));
                jsonObject.put("filter", array);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        syncNewRevEntittyRelationships(jsonObject);
    }

    private void syncNewRevEntittyRelationships(JSONObject jsonObject) {
        String postURL = REV_SESSION_SETTINGS.getRevRemoteServer() + "/rev_api/sync_new_rev_relationship";

        new RevAsyncJSONPostTaskService(mContext, postURL, jsonObject).revPostJSON(new IRevAsyncJSONPostTask() {
            @Override
            public void processFinishAsyncJSONPostTask(JSONObject jsonObject) {
                if (jsonObject == null) return;

                JSONArray jArr = null;
                try {
                    jArr = jsonObject.getJSONArray("filter");
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                for (int i = 0; i < jArr.length(); i++) {
                    JSONObject e;
                    try {
                        e = jArr.getJSONObject(i);

                        Long revEntityRelationshipId = Long.parseLong(e.getString("_revEntityRelationshipId"));
                        Long revEntityRelationshipRemoteId = Long.parseLong(e.getString("_revEntityRelationshipRemoteId"));

                        if (revEntityRelationshipRemoteId < 1) {
                            revPersLibUpdate.revPersUpdateRelResStatus_By_RelId(revEntityRelationshipId, -1);
                            continue;
                        }

                        int revResolveStatus = Integer.parseInt(e.getString("_revResolveStatus"));

                        int revReturnVal;

                        if (revResolveStatus == -2) {
                            revReturnVal = revPersLibUpdate.revPersUpdateRelationshipResolve_RemoteRelId_ResolveStatus_By_ValueId(revEntityRelationshipId, revEntityRelationshipRemoteId, 2);
                            if (revReturnVal == -1) i--;
                        } else if (revResolveStatus == -1) {
                            revReturnVal = revPersLibUpdate.revPersUpdateRelationshipResolve_RemoteRelId_ResolveStatus_By_ValueId(revEntityRelationshipId, revEntityRelationshipRemoteId, 0);
                            if (revReturnVal == -1) i--;
                        }
                    } catch (JSONException e1) {
                        e1.printStackTrace();
                    }
                }
            }
        });
    }
}
