package rev.ca.rev_gen_lib_pers.c_libs_core.rev_java_lib.rev_pre_pers;

import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibUpdate;
import rev.ca.rev_lib_gen_functions.I_REV_PROCESS_FINISH;

public class RevPersSetRelsRemoteGUIDs {

    private RevPersLibRead revPersLibRead = new RevPersLibRead();
    private RevPersLibUpdate revPersLibUpdate = new RevPersLibUpdate();

    public RevPersSetRelsRemoteGUIDs(I_REV_PROCESS_FINISH i_rev_process_finish) {
        this.setRemoteSubjectGUIDs();
        this.setRemotetargetGUIDs();

        i_rev_process_finish.REV_PROCESS_FINISH(null);
    }

    private void setRemoteSubjectGUIDs() {
        for (long revRelId : revPersLibRead.revPersGetUnresolvedRemoteSubjectGUIDSRelIds()) {
            long revRemoteEntityGUID = revPersLibRead.revGetRemoteEntityGUID_BY_LocalEntityGUID(revPersLibRead.getRevRelationshipSubjectGUID_By_RelId(revRelId));
            revPersLibUpdate.revPersUpdateSetRemoteSubjectGUID_By_RelId(revRelId, revRemoteEntityGUID);
        }
    }

    private void setRemotetargetGUIDs() {
        for (long revRelId : revPersLibRead.revPersGetUnresolvedRemoteTargetGUIDSRelIds()) {
            long revRemoteEntityGUID = revPersLibRead.revGetRemoteEntityGUID_BY_LocalEntityGUID(revPersLibRead.getRevRelationshipTargetGUID_By_RelationshipId(revRelId));
            revPersLibUpdate.revPersUpdateSetRemoteTarget_By_RelId(revRelId, revRemoteEntityGUID);
        }
    }
}
