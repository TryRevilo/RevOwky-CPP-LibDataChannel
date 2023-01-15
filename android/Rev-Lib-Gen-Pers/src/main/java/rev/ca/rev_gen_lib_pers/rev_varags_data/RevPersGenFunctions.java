package rev.ca.rev_gen_lib_pers.rev_varags_data;

import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;
import rev.ca.rev_lib_gen_functions.RevLibGenConstantine;

/**
 * Created by rev on 2/5/18.
 */

public class RevPersGenFunctions {

    public static RevVarArgsData REV_VAR_ARGS_DATA_RESOLVER(RevVarArgsData revVarArgsData) {
        if (revVarArgsData.getmContext() == null)
            revVarArgsData.setmContext(RevLibGenConstantine.REV_CONTEXT);

        return revVarArgsData;
    }

    public static Long GET_REV_OWNER_ENTITY_GUID(RevVarArgsData revVarArgsData) {
        Long revEntityOwnerGUID;

        if (revVarArgsData == null)
            return RevPersConstantine.REV_LOGGED_IN_ENTITY_GUID;

        if (revVarArgsData.getRevOwnerEntityGUID() != null) {
            revEntityOwnerGUID = revVarArgsData.getRevOwnerEntityGUID();
        } else {
            revEntityOwnerGUID = RevPersConstantine.REV_LOGGED_IN_ENTITY_GUID;
        }

        return revEntityOwnerGUID;
    }

    public static RevEntity SET_REV_OWNER_REV_CONTAINER_ENTITY_GUID(RevEntity revEntity, RevVarArgsData revVarArgsData) {
        if (revVarArgsData == null) {
            revVarArgsData = new RevVarArgsData();
            revVarArgsData.setRevOwnerEntityGUID(RevPersConstantine.REV_LOGGED_IN_ENTITY_GUID);
        } else {
            if (revVarArgsData.getRevOwnerEntityGUID() != null)
                revEntity.set_revEntityOwnerGUID(revVarArgsData.getRevOwnerEntityGUID());

            if (revVarArgsData.getRevContainerEntityGUID() != null)
                revEntity.set_revEntityContainerGUID(revVarArgsData.getRevContainerEntityGUID());
        }

        return revEntity;
    }

    public static void REV_SET_REV_ENTITY_RESOLVED(RevEntity revEntity) {
        if (revEntity.get_revEntitySubType().equals("rev_file")) {
            revEntity.set_revEntityResolveStatus(7);
        } else revEntity.set_revEntityResolveStatus(0);

        List<RevEntity> revChildrenEntityList = revEntity.get_revEntityChildrenList();

        if (revChildrenEntityList.size() > 0) {
            for (RevEntity revChildEntity : revChildrenEntityList) {
                REV_SET_REV_ENTITY_RESOLVED(revChildEntity);
            }
        }
    }

    public static void REV_SET_METADATA_RESOLVED(RevEntity revEntity) {
        List<RevEntityMetadata> revInfoEntityMetadataList = revEntity.get_revEntityMetadataList();

        if (!revInfoEntityMetadataList.isEmpty()) {
            for (int i = 0; i < revInfoEntityMetadataList.size(); i++)
                revInfoEntityMetadataList.get(i).set_resolveStatus(0);
        }

        List<RevEntity> revChildrenEntityList = revEntity.get_revEntityChildrenList();

        if (revChildrenEntityList.size() > 0) {
            for (RevEntity revChildEntity : revChildrenEntityList) {
                REV_SET_METADATA_RESOLVED(revChildEntity);
            }
        }
    }

    public static void REV_SET_REV_ENTITY_DATA_RES_STATUS_RESOLVED(RevEntity revEntity) {
        REV_SET_REV_ENTITY_RESOLVED(revEntity);
        REV_SET_METADATA_RESOLVED(revEntity);
    }
}
