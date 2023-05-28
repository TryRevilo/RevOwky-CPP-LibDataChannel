package rev.ca.rev_gen_lib_pers.c_libs_core;

public class RevPersLibDelete {

    static {
        System.loadLibrary("rev-pers-lib-db-delete");
    }

    public native int revDeleteEntity_By_EntityGUID(long revEntityGUID);

    public native int deleteRevRel_By_Unset_Subject_Target_GUID(long revUnsetRelEntityGUID, long revUnsetRelEntityRemoteGUID);

    public native int revDeleteEntityAnnotation_By_AnnotationID(long revAnnotationID);

}
