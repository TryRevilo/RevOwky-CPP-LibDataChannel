package rev.ca.rev_gen_lib_pers.c_libs_core.rev_java_lib;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityRelationship;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibCreate;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_entity.RevSaveRevEntitiesToServerResolver;
import rev.ca.rev_lib_gen_functions.REV_STRINGS_BASE_FUNCTIONS;
import rev.ca.rev_lib_gen_functions.RevLibGenConstantine;

public class RevPersJava {

    private RevPersLibCreate revPersLibCreate = new RevPersLibCreate();

    public RevPersJava() {
    }

    public Object saveRevEntity(final Object revObject) {
        Long revPersId = null;

        if (revObject.getClass() == RevEntity.class) {
            RevEntity revEntity = (RevEntity) revObject;

            if (revEntity == null || REV_STRINGS_BASE_FUNCTIONS.REV_IS_NULL_OR_EMPTY_STRING(revEntity.get_revEntityType()) || REV_STRINGS_BASE_FUNCTIONS.REV_IS_NULL_OR_EMPTY_STRING(revEntity.get_revEntitySubType()))
                return -1L;

            revPersId = revPersLibCreate.revPersInit(revEntity);
            revEntity.set_revEntityGUID(revPersId);

        } else if (revObject.getClass() == RevEntityRelationship.class) {
            revPersId = revPersLibCreate.revPersRelationship((RevEntityRelationship) revObject);
        }

        return revPersId;
    }

    public Object saveRevEntity_NO_REMOTE_SYNC(final Object revObject) {
        Long revPersId = null;

        if (revObject.getClass() == RevEntity.class) {
            RevEntity revEntity = (RevEntity) revObject;

            if (revEntity == null || REV_STRINGS_BASE_FUNCTIONS.REV_IS_NULL_OR_EMPTY_STRING(revEntity.get_revEntityType()) || REV_STRINGS_BASE_FUNCTIONS.REV_IS_NULL_OR_EMPTY_STRING(revEntity.get_revEntitySubType()))
                return -1L;

            revPersId = revPersLibCreate.revPersInit(revEntity);
            revEntity.set_revEntityGUID(revPersId);

        } else if (revObject.getClass() == RevEntityRelationship.class) {
            revPersId = revPersLibCreate.revPersRelationship((RevEntityRelationship) revObject);
        }

        return revPersId;

    }
}
