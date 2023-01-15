package rev.ca.rev_gen_lib_pers.rev_pers_gen_functions;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityRelationship;

public class REV_RELS {

    public static long REV_GET_ALT_REL_GUID(RevEntityRelationship revEntityRelationship, long revGUID) {
        long revSubjectGUID = revEntityRelationship.get_revEntitySubjectGUID();
        long revTargetGUID = revEntityRelationship.get_revEntityTargetGUID();

        return revSubjectGUID == revGUID ? revTargetGUID : revSubjectGUID;
    }
}
