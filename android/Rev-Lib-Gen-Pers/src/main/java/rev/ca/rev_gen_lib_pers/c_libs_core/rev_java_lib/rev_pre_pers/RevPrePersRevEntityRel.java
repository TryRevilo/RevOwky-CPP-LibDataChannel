package rev.ca.rev_gen_lib_pers.c_libs_core.rev_java_lib.rev_pre_pers;

import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibCreate;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.c_libs_core.rev_java_lib.RevPersJava;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityRelationship;

public class RevPrePersRevEntityRel {

    RevPersJava revPersJava;

    RevPersLibRead revPersLibRead;
    RevPersLibCreate revPersLibCreate;

    public RevPrePersRevEntityRel() {
        revPersJava = new RevPersJava();

        revPersLibRead = new RevPersLibRead();
        revPersLibCreate = new RevPersLibCreate();
    }

    public long revPersRelationship(RevEntityRelationship revEntityRelationship) {
        if (revEntityRelationship.get_subjectRevEntity() != null) {
            long revRelationshipId = -1;

            RevEntity subjectRevEntity = revEntityRelationship.get_subjectRevEntity();
            RevEntity targetRevEntity = revEntityRelationship.get_targetRevEntity();

            int subjectRevEntityExists = revPersLibRead.revEntityExistsByRemoteEntityGUID(subjectRevEntity.get_remoteRevEntityGUID());
            int targetRevEntityExists = revPersLibRead.revEntityExistsByRemoteEntityGUID(targetRevEntity.get_remoteRevEntityGUID());

            if (subjectRevEntityExists < 0) {
                subjectRevEntity = revPersLibRead.revPersGetRevEntityByGUID(
                        (Long) revPersJava.saveRevEntity(subjectRevEntity)
                );
            }

            if (targetRevEntityExists < 0) {
                targetRevEntity = revPersLibRead.revPersGetRevEntityByGUID(
                        (Long) revPersJava.saveRevEntity(targetRevEntity)
                );
            }

            boolean relExists = revPersLibRead.revEntityRelationshipExists(
                    "rev_entity_connect_members", subjectRevEntity.get_revEntityGUID(), targetRevEntity.get_revEntityGUID()) >= 0;

            if (!relExists) {
                revRelationshipId = (long) revPersJava.saveRevEntity(
                        new RevEntityRelationship("rev_entity_connect_members", subjectRevEntity.get_revEntityGUID(), targetRevEntity.get_revEntityGUID()));
            }

            return revRelationshipId;
        }

        Long subjectRevEntityGUID = revEntityRelationship.get_revEntitySubjectGUID();
        Long targetRevEntityGUID = revEntityRelationship.get_revEntityTargetGUID();

        long revRelationshipId = -1;

        boolean relExists = revPersLibRead.revEntityRelationshipExists(
                "rev_entity_connect_members", subjectRevEntityGUID, targetRevEntityGUID) >= 0;

        if (!relExists) {
            revRelationshipId = (long) new RevPersJava().saveRevEntity(revEntityRelationship);
        }

        return revRelationshipId;

    }
}
