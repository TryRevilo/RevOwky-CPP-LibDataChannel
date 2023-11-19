package rev.ca.rev_gen_lib_pers.c_libs_core;

import rev.ca.rev_lib_interfaces.IRevLibCallBack;

public class RevPersLibDelete {

    static {
        System.loadLibrary("rev-pers-lib-db-delete");
    }

    public native int revPersDeleteEntity_And_Children_By_EntityGUID(long revEntityGUID);

    public native int revDeleteEntity_By_EntityGUID(long revEntityGUID);

    public native int revDeleteEntityMetadata_By_ID(long _revId);

    public native int revPersDeleteAnn_By_AnnId(long revAnnotationID);

    // FILES
    public native void revAsyDeleteFilesFromPathsStrArr(String revJsonFilePathsArrStr, IRevLibCallBack iRevLibCallBack);

}
