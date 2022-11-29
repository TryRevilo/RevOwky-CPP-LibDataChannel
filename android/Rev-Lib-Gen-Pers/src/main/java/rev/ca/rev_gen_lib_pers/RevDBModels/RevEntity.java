package rev.ca.rev_gen_lib_pers.RevDBModels;

import java.util.ArrayList;
import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.rev_entity_subtypes.RevGroupEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.rev_entity_subtypes.RevObjectEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.rev_entity_subtypes.RevUserEntity;

public class RevEntity {

    private String _revEntityType;
    private String _revEntitySubType;

    private Long _revEntityGUID = -1L;
    private Long _remoteRevEntityGUID = -1L;
    private Long _revEntityOwnerGUID = -1L;
    private Long _revEntityContainerGUID = -1L;
    private Long _revEntityRemoteContainerGUID = -1L;
    private Long _revEntitySiteGUID = -1L;

    private int _revEntityAccessPermission = -1;
    private int _revEntityResolveStatus = -1;

    /**
     * -1 = NO CHILDREN. NO PARENT (ONLY TIED VIA RELATIONSHIPS)
     * 0 = NO CHILDREN. HAS PARENT
     * 1 = HAS CHILDREN. NO PARENT
     * 2 = HAS CHILDREN. HAS PARENT
     * 3 = HAS CHILDREN. HAS PARENT. HAS RELATIONSHIPS
     **/

    private int _revEntityChildableStatus = -1;
    private boolean _fromRemote;

    private String _timeCreated = "";
    private String _timeUpdated = "";

    private long _revTimeCreated = -1;
    private long _revTimePublished = -1;
    private long _revTimePublishedUpdated = -1;

    List<RevEntityMetadata> _revEntityMetadataList = new ArrayList<>();
    List<RevAnnotation> _revAnnotations = new ArrayList<>();

    RevObjectEntity revObjectEntity;
    RevGroupEntity revGroupEntity;
    RevUserEntity revUserEntity;

    List<RevEntity> _revEntityChildrenList = new ArrayList<>();

    RevEntity _revPublisherEntity;
    RevEntity _revInfoEntity;
    RevEntity _revSocialInfoEntity;

    public RevEntity() {
    }

    public String get_revEntityType() {
        return _revEntityType;
    }

    public void set_revEntityType(String _revEntityType) {
        this._revEntityType = _revEntityType;
    }

    public String get_revEntitySubType() {
        return _revEntitySubType;
    }

    public void set_revEntitySubType(String _revEntitySubType) {
        this._revEntitySubType = _revEntitySubType;
    }

    public Long get_revEntityGUID() {
        return _revEntityGUID;
    }

    public void set_revEntityGUID(Long _revEntityGUID) {
        this._revEntityGUID = _revEntityGUID;
    }

    public Long get_remoteRevEntityGUID() {
        return _remoteRevEntityGUID;
    }

    public void set_remoteRevEntityGUID(Long _remoteRevEntityGUID) {
        this._remoteRevEntityGUID = _remoteRevEntityGUID;
    }

    public Long get_revEntityOwnerGUID() {
        return _revEntityOwnerGUID;
    }

    public void set_revEntityOwnerGUID(Long _revEntityOwnerGUID) {
        this._revEntityOwnerGUID = _revEntityOwnerGUID;
    }

    public Long get_revEntityContainerGUID() {
        return _revEntityContainerGUID;
    }

    public void set_revEntityContainerGUID(Long _revEntityContainerGUID) {
        this._revEntityContainerGUID = _revEntityContainerGUID;
    }

    public Long get_revEntityRemoteContainerGUID() {
        return _revEntityRemoteContainerGUID;
    }

    public void set_revEntityRemoteContainerGUID(Long _revEntityRemoteContainerGUID) {
        this._revEntityRemoteContainerGUID = _revEntityRemoteContainerGUID;
    }

    public Long get_revEntitySiteGUID() {
        return _revEntitySiteGUID;
    }

    public void set_revEntitySiteGUID(Long _revEntitySiteGUID) {
        this._revEntitySiteGUID = _revEntitySiteGUID;
    }

    public int get_revEntityAccessPermission() {
        return _revEntityAccessPermission;
    }

    public void set_revEntityAccessPermission(int _revEntityAccessPermission) {
        this._revEntityAccessPermission = _revEntityAccessPermission;
    }

    public int get_revEntityResolveStatus() {
        return _revEntityResolveStatus;
    }

    public void set_revEntityResolveStatus(int _revEntityResolveStatus) {
        this._revEntityResolveStatus = _revEntityResolveStatus;
    }

    public int get_revEntityChildableStatus() {
        return _revEntityChildableStatus;
    }

    public void set_revEntityChildableStatus(int _revEntityChildableStatus) {
        this._revEntityChildableStatus = _revEntityChildableStatus;
    }

    public boolean is_fromRemote() {
        return _fromRemote;
    }

    public void set_fromRemote(boolean _fromRemote) {
        this._fromRemote = _fromRemote;
    }

    public String get_timeCreated() {
        return _timeCreated;
    }

    public void set_timeCreated(String _timeCreated) {
        this._timeCreated = _timeCreated;
    }

    public String get_timeUpdated() {
        return _timeUpdated;
    }

    public void set_timeUpdated(String _timeUpdated) {
        this._timeUpdated = _timeUpdated;
    }

    public long get_revTimeCreated() {
        return _revTimeCreated;
    }

    public void set_revTimeCreated(long _revTimeCreated) {
        this._revTimeCreated = _revTimeCreated;
    }

    public long get_revTimePublished() {
        return _revTimePublished;
    }

    public void set_revTimePublished(long _revTimePublished) {
        this._revTimePublished = _revTimePublished;
    }

    public long get_revTimePublishedUpdated() {
        return _revTimePublishedUpdated;
    }

    public void set_revTimePublishedUpdated(long _revTimePublishedUpdated) {
        this._revTimePublishedUpdated = _revTimePublishedUpdated;
    }

    public List<RevEntityMetadata> get_revEntityMetadataList() {
        return _revEntityMetadataList;
    }

    public void set_revEntityMetadataList(List<RevEntityMetadata> _revEntityMetadataList) {
        this._revEntityMetadataList = _revEntityMetadataList;
    }

    public List<RevAnnotation> get_revAnnotations() {
        return _revAnnotations;
    }

    public void set_revAnnotations(List<RevAnnotation> _revAnnotations) {
        this._revAnnotations = _revAnnotations;
    }

    public RevObjectEntity getRevObjectEntity() {
        return revObjectEntity;
    }

    public void setRevObjectEntity(RevObjectEntity revObjectEntity) {
        this.revObjectEntity = revObjectEntity;
    }

    public RevGroupEntity getRevGroupEntity() {
        return revGroupEntity;
    }

    public void setRevGroupEntity(RevGroupEntity revGroupEntity) {
        this.revGroupEntity = revGroupEntity;
    }

    public RevUserEntity getRevUserEntity() {
        return revUserEntity;
    }

    public void setRevUserEntity(RevUserEntity revUserEntity) {
        this.revUserEntity = revUserEntity;
    }

    public List<RevEntity> get_revEntityChildrenList() {
        return _revEntityChildrenList;
    }

    public void set_revEntityChildrenList(List<RevEntity> _revEntityChildrenList) {
        this._revEntityChildrenList = _revEntityChildrenList;
    }

    public RevEntity get_revPublisherEntity() {
        return _revPublisherEntity;
    }

    public void set_revPublisherEntity(RevEntity _revPublisherEntity) {
        this._revPublisherEntity = _revPublisherEntity;
    }

    public RevEntity get_revInfoEntity() {
        return _revInfoEntity;
    }

    public void set_revInfoEntity(RevEntity _revInfoEntity) {
        this._revInfoEntity = _revInfoEntity;
    }

    public RevEntity get_revSocialInfoEntity() {
        return _revSocialInfoEntity;
    }

    public void set_revSocialInfoEntity(RevEntity _revSocialInfoEntity) {
        this._revSocialInfoEntity = _revSocialInfoEntity;
    }
}
