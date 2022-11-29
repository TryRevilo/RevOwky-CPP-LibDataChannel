package rev.ca.rev_gen_lib_pers.rev_server_client;

import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import rev.ca.rev_lib_gen_functions.RevLangStrings;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.rev_entity_subtypes.RevGroupEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.rev_entity_subtypes.RevObjectEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.rev_entity_subtypes.RevUserEntity;

public class RevJSONEntityConstructor {

    public RevJSONEntityConstructor() {
    }

    public RevEntity revEntityFromJSON(JSONObject jsonObject) {
        RevEntity revEntity = new RevEntity();

        try {
            revEntity.set_revEntityGUID(Long.parseLong(jsonObject.getString("LOCAL_REV_ENTITY_GUID")));
            revEntity.set_remoteRevEntityGUID(Long.parseLong(jsonObject.getString("REMOTE_REV_ENTITY_GUID")));
            revEntity.set_revEntityOwnerGUID(Long.parseLong(jsonObject.getString("REV_ENTITY_OWNER_GUID")));
            revEntity.set_revEntityContainerGUID(Long.parseLong(jsonObject.getString("REV_ENTITY_CONTAINER_GUID")));
            revEntity.set_revEntityResolveStatus(Integer.parseInt(jsonObject.getString("REV_RESOLVE_STATUS")));
            revEntity.set_revEntityAccessPermission(Integer.parseInt(jsonObject.getString("REV_ENTITY_ACCESS_PERMISSION")));
            revEntity.set_revEntitySiteGUID(Long.parseLong(jsonObject.getString("REV_ENTITY_SITE_GUID")));

            revEntity.set_revEntityType(jsonObject.getString("REV_ENTITY_TYPE"));
            revEntity.set_revEntitySubType(jsonObject.getString("REV_ENTITY_SUB_TYPE"));

        } catch (JSONException e) {
            e.printStackTrace();
        }

        return revEntity;
    }

    public RevObjectEntity revObjectEntityFromJSON(JSONObject jsonObject) {
        RevObjectEntity revObjectEntity = new RevObjectEntity();

        try {
            revObjectEntity.set_revObjectName(jsonObject.getString("REV_OBJECT_NAME"));
            revObjectEntity.set_revObjectDescription(jsonObject.getString("REV_OBJECT_DESCRIPTION"));

        } catch (JSONException e) {
            e.printStackTrace();
        }

        return revObjectEntity;
    }

    public RevUserEntity revUserEntityFromJSON(JSONObject jsonObject) {
        RevUserEntity revUserEntity = new RevUserEntity();

        try {
            revUserEntity.set_email(jsonObject.getString("COLUMN_NAME_REV_USER_EMAIL"));
            revUserEntity.set_fullNames(jsonObject.getString("COLUMN_NAME_REV_USER_FULL_NAMES"));

        } catch (JSONException e) {
            e.printStackTrace();
        }

        return revUserEntity;
    }

    public RevGroupEntity revGroupEntityFromJSON(JSONObject jsonObject) {
        RevGroupEntity revGroupEntity = new RevGroupEntity();

        try {
            revGroupEntity.setName(jsonObject.getString("REV_REV_USER_EMAIL"));
            revGroupEntity.setDescription(jsonObject.getString("REV_REV_USER_FULL_NAMES"));

        } catch (JSONException e) {
            e.printStackTrace();
        }

        return revGroupEntity;
    }
}
