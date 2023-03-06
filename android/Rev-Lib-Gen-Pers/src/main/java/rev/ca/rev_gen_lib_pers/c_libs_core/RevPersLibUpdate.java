package rev.ca.rev_gen_lib_pers.c_libs_core;

import java.util.List;

public class RevPersLibUpdate {

    static {
        System.loadLibrary("rev-pers-lib-db-update");
    }

    public native int setRemoteRevEntityGUIDByRevEntityGUID(long revEntityGUID, long remoteRevEntityGUID);

    public native int setRevPublishedDate_By_RevEntityGUID(long revEntityGUID, long revPublishedDate);

    public native int setRemoteRevEntityGUID_By_RevCreationDate(long revTimeCreated, long remoteRevEntityGUID);

    public native int resetRevEntityOwnerGUID(long revEntityGUID, long revEntityOwnerGUID);

    public native int revPersSetContainerGUID_By_RevEntityGUID(long revEntityGUID, long revContainerGUID);

    public native int setRemoteRevEntityGUID_RemoteMetadataId_LIST(long revEntityGUID, long remoteRevEntityGUID, List<String> revEntityMetadataList);

    public native int setRemoteRevEntityGUID_RemoteMetadataId_Array(long revEntityGUID, long remoteRevEntityGUID, String revEntityMetadataJSONArray);

    public native int setRemoteRevEntityGUID_Metadata_ByRevEntityGUID(long revEntityGUID, long remoteRevEntityGUID, long revMetadataId, long remoteRevMetadataId);

    public native int setRevEntityResolveStatusByRevEntityGUID(int resolveStatus, long revEntityGUID);

    public native int setResStatus_By_RevCreationDate(long revTimeCreated, int revResStatus);

    /**
     * START REV ENTITY METADATA
     **/

    public native int setMetadataResolveStatus_BY_METADATA_ID(int revResolveStatus, long revMetadataId);

    public native int setRemoteRevEntityMetadataId(long revMetadataId, long remoteRevMetadataId);

    public native int setMetadataResolveStatus_BY_MetadataName_RevEntityGUID(String revMetadataName, long revEntityGUID, int revResolveStatus);

    public native int setMetadataValue_BY_MetadataId(long revMetadataId, String revMetadataValue);

    /** END REV ENTITY METADATA **/

    /**
     * START REV ENTITY REL
     **/

    public native int revPersUpdateRelResStatus_By_RelId(long revEntityRelationshipId, int resolveStatus);

    public native int revPersUpdateRelResStatus_By_RemoteRelId(long revEntityRelationshipId, int resolveStatus);

    public native int revPersUpdateSetRelResStatus_By_RemoteRelId(long revEntityRemoteRelationshipId, int revRelResStatus);

    public native int revPersUpdateRelationshipResolve_RemoteRelId_ResolveStatus_By_ValueId(long revEntityRelationshipId, long revEntityRemoteRelationshipId, int resolveStatus);

    public native int revPersSetRemoteRelationshipRemoteId(long revEntityRelationshipId, long revEntityRemoteRelationshipId);

    public native int revPersUpdateSetRemoteRelationshipRemoteId_By_RevRelType_RemoteSubjectGUID_RemoteTarhetGUID(String revEntityrelationship, long revRemoteSubjectGUID, long revRemoteTargetGUID, long revRemoteRelId);

    public native int revPersSetRemoteRelationshipResolved(long revEntityRelationshipId, long revEntityRemoteRelationshipId);

    public native long updateRevEntityRelationshipTypeValueId(long revEntityRelationshipId, long relationshipValueId);

    public native int revPersUpdateSetRemoteSubjectGUID_By_RelId(long revRelId, long revRemoteSubjectGUID);

    public native int revPersUpdateSetRemoteTarget_By_RelId(long revRelId, long revRemotetargetGUID);

    public native int revPersUpdateSetRemoteSubjectGUID(long localSubjectGUID, long remoteSubjectGUID);

    public native int revPersUpdateSetRemoteTargetGUID(long localTargetGUID, long remoteTargetGUID);


    /** END REV ENTITY REL **/


    /**
     * REV ENTITY ANNOTATIONS
     **/

    public native int revPersSetRevAnnResStatus_By_RevAnnId(long revAnnotationId, int revAnnotationResStatus);

    public native int revPersSetRemoteRevAnnId(long revAnnotationId, long revAnnotationRemoteId);

    /** REV ENTITY ANNOTATIONS **/


}
