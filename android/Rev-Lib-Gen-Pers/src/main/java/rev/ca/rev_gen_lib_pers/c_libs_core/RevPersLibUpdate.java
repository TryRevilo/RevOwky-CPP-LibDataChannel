package rev.ca.rev_gen_lib_pers.c_libs_core;

import java.util.List;

public class RevPersLibUpdate {

    static {
        System.loadLibrary("rev-pers-lib-db-update");
    }

    public native int setrevRemoteEntityGUIDByRevEntityGUID(long revEntityGUID, long revRemoteEntityGUID);

    public native int setRevPublishedDate_By_RevEntityGUID(long revEntityGUID, long revPublishedDate);

    public native int resetRevEntityOwnerGUID(long revEntityGUID, long revEntityOwnerGUID);

    public native int setRevEntityResolveStatusByRevEntityGUID(int revResolveStatus, long revEntityGUID);

    /**
     * START REV ENTITY METADATA
     **/

    public native int setMetadataResolveStatus_BY_METADATA_ID(int revResolveStatus, long revMetadataId);

    public native int setRemoteRevEntityMetadataId(long revMetadataId, long _revRemoteMetadataId);

    public native int setMetadataResolveStatus_BY_revMetadataName_RevEntityGUID(String revMetadataName, long revEntityGUID, int revResolveStatus);

    public native int setMetadataValue_BY_MetadataId(long revMetadataId, String revMetadataValue);

    /** END REV ENTITY METADATA **/

    /**
     * START REV ENTITY REL
     **/

    public native int revPersUpdateRelResStatus_By_RelId(long revEntityRelationshipId, int revResolveStatus);

    public native int revPersSetRemoteRelationshipRemoteId(long revEntityRelationshipId, long revEntityRemoteRelationshipId);

    public native int revPersUpdateSetRemoteSubjectGUID(long localSubjectGUID, long remoteSubjectGUID);

    public native int revPersUpdateSetRemoteTargetGUID(long localTargetGUID, long remoteTargetGUID);


    /** END REV ENTITY REL **/


    /**
     * REV ENTITY ANNOTATIONS
     **/

    public native int revPersSetRevAnnVal_By_RevAnnId(long revAnnotationId, String revEntityAnnotationValue);

    public native int revPersSetRevAnnResStatus_By_RevAnnId(long revAnnotationId, int revAnnotationResStatus);

    public native int revPersSetRemoteRevAnnId(long revAnnotationId, long revAnnotationRemoteId);

    /** REV ENTITY ANNOTATIONS **/


}
