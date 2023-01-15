package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_entity;

import android.content.Context;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibUpdate;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server.IRevAsyncJSONResponse;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_read_from_server.RevAsyncGetJSONResponseTaskService;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;
import rev.ca.rev_gen_lib_pers.rev_varags_data.RevVarArgsData;
import rev.ca.rev_lib_gen_functions.RevLangStrings;

public class RevResolvePartialEntityUploads {

    public interface IRevResolvePartialEntityUploads {
        void revProcessFinish();
    }

    private Context mContext;
    private IRevResolvePartialEntityUploads iRevResolvePartialEntityUploads;

    private RevPersLibRead revPersLibRead = new RevPersLibRead();
    private RevPersLibUpdate revPersLibUpdate = new RevPersLibUpdate();

    public RevResolvePartialEntityUploads(RevVarArgsData revVarArgsData, IRevResolvePartialEntityUploads iRevResolvePartialEntityUploads) {
        this.mContext = revVarArgsData.getmContext();
        this.iRevResolvePartialEntityUploads = iRevResolvePartialEntityUploads;

        this.revSyncPartialEntityUploads();
    }

    private List<String> syncObjs() {
        List<Long> revEntityGUIDsList = revPersLibRead.revPersGetALLRevEntityGUIDs_By_ResStatus(-101);

        if (revEntityGUIDsList.isEmpty()) return null;

        List<String> stringArrayList = new ArrayList<>();

        for (long revEntityGUID : revEntityGUIDsList) {
            RevEntity revEntity = revPersLibRead.revPersGetRevEntityByGUID(revEntityGUID);

            if (revEntity == null) continue;

            stringArrayList.add(String.valueOf(revEntity.get_revTimeCreated()));

            revPersLibUpdate.setRevEntityResolveStatusByRevEntityGUID(-107, revEntity.get_revEntityGUID());
        }

        return stringArrayList;
    }

    private void revSyncPartialEntityUploads() {
        List<String> syncObjs = this.syncObjs();

        if (syncObjs != null && syncObjs.size() > 0) {
            String revItems = syncObjs.toString().replace("[", "").replace("]", "").replace(" ", "");

            String postURL = REV_SESSION_SETTINGS.getRevRemoteServer() + "/rev_api/get_remote_entity_guid_by_creation_date?rev_items=" + revItems;

            new RevAsyncGetJSONResponseTaskService(mContext, postURL, new IRevAsyncJSONResponse() {
                @Override
                public void processFinishAsyncJSONResponse(JSONObject jsonObject) {
                    if (jsonObject == null) return;

                    JSONArray jArr = null;
                    try {
                        jArr = jsonObject.getJSONArray("filter");
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                    if (jArr == null) return;

                    for (int i = 0; i < jArr.length(); i++) {
                        JSONObject e;
                        try {
                            e = jArr.getJSONObject(i);

                            long revTimeCreated = e.getLong("_revTimeCreated");
                            long remoteRevEntityGUID = e.getLong("_remoteRevEntityGUID");

                            int revUpdateStatus = -1;

                            if (remoteRevEntityGUID > 0) {
                                revUpdateStatus = revPersLibUpdate.setRemoteRevEntityGUID_By_RevCreationDate(revTimeCreated, remoteRevEntityGUID);
                            }

                            if (revUpdateStatus == -1) {
                                revPersLibUpdate.setResStatus_By_RevCreationDate(revTimeCreated, -1);
                            }

                            Log.v(RevLangStrings.REV_TAG, "revUpdateStatus : " + revUpdateStatus + " revTimeCreated : " + revTimeCreated + " remoteRevEntityGUID : " + remoteRevEntityGUID);
                        } catch (JSONException e1) {
                            e1.printStackTrace();
                        }
                    }

                    revSyncPartialEntityUploads();
                }
            }).execute();
        } else iRevResolvePartialEntityUploads.revProcessFinish();
    }
}
