package rev.ca.rev_gen_lib_pers.RevDBModels;

import java.util.ArrayList;
import java.util.List;

public class RevEntity {

    private String _revEntityType;
    private String _revEntitySubType;

    private Long _revEntityGUID = -1L;
    private Long _revRemoteEntityGUID = -1L;
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

    private Long _revTimeCreated = -1L;
    private Long _revTimePublished = -1L;
    private Long _revTimePublishedUpdated = -1L;

    List<RevEntityMetadata> _revEntityMetadataList = new ArrayList<>();
    List<RevAnnotation> _revAnnotations = new ArrayList<>();

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

    public Long get_revRemoteEntityGUID() {
        return _revRemoteEntityGUID;
    }

    public void set_revRemoteEntityGUID(Long _revRemoteEntityGUID) {
        this._revRemoteEntityGUID = _revRemoteEntityGUID;
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

    public Long get_revTimeCreated() {
        return _revTimeCreated;
    }

    public void set_revTimeCreated(Long _revTimeCreated) {
        this._revTimeCreated = _revTimeCreated;
    }

    public Long get_revTimePublished() {
        return _revTimePublished;
    }

    public void set_revTimePublished(Long _revTimePublished) {
        this._revTimePublished = _revTimePublished;
    }

    public Long get_revTimePublishedUpdated() {
        return _revTimePublishedUpdated;
    }

    public void set_revTimePublishedUpdated(Long _revTimePublishedUpdated) {
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
