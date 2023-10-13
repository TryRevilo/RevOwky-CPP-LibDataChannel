package rev.ca.rev_gen_lib_pers.RevDBModels;

import java.util.ArrayList;
import java.util.List;

public class RevEntity {

    private String _revType;
    private String _revSubType;

    private Long _revGUID = -1L;
    private Long _revRemoteGUID = -1L;
    private Long _revOwnerGUID = -1L;
    private Long _revContainerGUID = -1L;
    private Long _revRemoteContainerGUID = -1L;
    private Long _revSiteGUID = -1L;

    private int _revAccessPermission = -1;
    private int _revResolveStatus = -1;

    /**
     * -1 = NO CHILDREN. NO PARENT (ONLY TIED VIA RELATIONSHIPS)
     * 0 = NO CHILDREN. HAS PARENT
     * 1 = HAS CHILDREN. NO PARENT
     * 2 = HAS CHILDREN. HAS PARENT
     * 3 = HAS CHILDREN. HAS PARENT. HAS RELATIONSHIPS
     **/

    private int _revChildableStatus = -1;
    private boolean _fromRemote;

    private Long _revTimeCreated = -1L;
    private Long _revTimePublished = -1L;
    private Long _revTimePublishedUpdated = -1L;

    List<RevEntityMetadata> _revMetadataList = new ArrayList<>();
    List<RevAnnotation> _revAnnotations = new ArrayList<>();

    List<RevEntity> _revChildrenList = new ArrayList<>();

    RevEntity _revPublisherEntity;
    RevEntity _revInfoEntity;
    RevEntity _revSocialInfoEntity;

    public RevEntity() {
    }

    public String get_revType() {
        return _revType;
    }

    public void set_revType(String _revType) {
        this._revType = _revType;
    }

    public String get_revSubType() {
        return _revSubType;
    }

    public void set_revSubType(String _revSubType) {
        this._revSubType = _revSubType;
    }

    public Long get_revGUID() {
        return _revGUID;
    }

    public void set_revGUID(Long _revGUID) {
        this._revGUID = _revGUID;
    }

    public Long get_revRemoteGUID() {
        return _revRemoteGUID;
    }

    public void set_revRemoteGUID(Long _revRemoteGUID) {
        this._revRemoteGUID = _revRemoteGUID;
    }

    public Long get_revOwnerGUID() {
        return _revOwnerGUID;
    }

    public void set_revOwnerGUID(Long _revOwnerGUID) {
        this._revOwnerGUID = _revOwnerGUID;
    }

    public Long get_revContainerGUID() {
        return _revContainerGUID;
    }

    public void set_revContainerGUID(Long _revContainerGUID) {
        this._revContainerGUID = _revContainerGUID;
    }

    public Long get_revRemoteContainerGUID() {
        return _revRemoteContainerGUID;
    }

    public void set_revRemoteContainerGUID(Long _revRemoteContainerGUID) {
        this._revRemoteContainerGUID = _revRemoteContainerGUID;
    }

    public Long get_revSiteGUID() {
        return _revSiteGUID;
    }

    public void set_revSiteGUID(Long _revSiteGUID) {
        this._revSiteGUID = _revSiteGUID;
    }

    public int get_revAccessPermission() {
        return _revAccessPermission;
    }

    public void set_revAccessPermission(int _revAccessPermission) {
        this._revAccessPermission = _revAccessPermission;
    }

    public int get_revResolveStatus() {
        return _revResolveStatus;
    }

    public void set_revResolveStatus(int _revResolveStatus) {
        this._revResolveStatus = _revResolveStatus;
    }

    public int get_revChildableStatus() {
        return _revChildableStatus;
    }

    public void set_revChildableStatus(int _revChildableStatus) {
        this._revChildableStatus = _revChildableStatus;
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

    public List<RevEntityMetadata> get_revMetadataList() {
        return _revMetadataList;
    }

    public void set_revMetadataList(List<RevEntityMetadata> _revMetadataList) {
        this._revMetadataList = _revMetadataList;
    }

    public List<RevAnnotation> get_revAnnotations() {
        return _revAnnotations;
    }

    public void set_revAnnotations(List<RevAnnotation> _revAnnotations) {
        this._revAnnotations = _revAnnotations;
    }

    public List<RevEntity> get_revChildrenList() {
        return _revChildrenList;
    }

    public void set_revChildrenList(List<RevEntity> _revChildrenList) {
        this._revChildrenList = _revChildrenList;
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
