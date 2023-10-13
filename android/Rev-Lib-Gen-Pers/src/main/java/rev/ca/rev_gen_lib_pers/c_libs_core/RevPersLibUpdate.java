package rev.ca.rev_gen_lib_pers.c_libs_core;

import java.util.List;

public class RevPersLibUpdate {

    static {
        System.loadLibrary("rev-pers-lib-db-update");
    }

    public native int revPersSetRemoteEntityGUID_By_LocalEntityGUID(long revEntityGUID, long revRemoteEntityGUID);

    public native int revPersSetPubDate_By_GUID(long revEntityGUID, long revPublishedDate);

    public native int revPersResetEntityOwnerGUID(long revEntityGUID, long revEntityOwnerGUID);

    public native int revPersSetEntityResStatus_By_EntityGUID(int revResolveStatus, long revEntityGUID);

    /**
     * START REV ENTITY METADATA
     **/

    public native int revPersSetMetadataResStatus_BY_Metadata_Id(int revResolveStatus, long _revId);

    public native int revPersSetRemoteMetadataId(long _revId, long _revRemoteId);

    public native int setMetadataResolveStatus_BY_revName_revGUID(String revMetadataName, long revEntityGUID,
            int revResolveStatus);

    public native int revPersSetMetadataVal_BY_Id(long _revId, String revMetadataValue);

    /** END REV ENTITY METADATA **/

    /**
     * START REV ENTITY REL
     **/

    public native int revPersUpdateRelResStatus_By_RelId(long revEntityRelationshipId, int revResolveStatus);

    public native int revPersSetRemoteRelId(long revEntityRelationshipId, long revEntityRemoteRelationshipId);

    public native int revPersSetRemoteSubjectGUID(long localSubjectGUID, long remoteSubjectGUID);

    public native int revPersSetRemoteTargetGUID(long localTargetGUID, long remoteTargetGUID);

    /** END REV ENTITY REL **/

    /**
     * REV ENTITY ANNOTATIONS
     **/

    public native int revPersSetAnnVal_By_Id(long revAnnotationId, String revEntityAnnotationValue);

    public native int revPersSetAnnResStatus_By_Id(long revAnnotationId, int revAnnotationResStatus);

    public native int revPersSetRemoteRevAnnId(long revAnnotationId, long revAnnotationRemoteId);

    /** REV ENTITY ANNOTATIONS **/

}
