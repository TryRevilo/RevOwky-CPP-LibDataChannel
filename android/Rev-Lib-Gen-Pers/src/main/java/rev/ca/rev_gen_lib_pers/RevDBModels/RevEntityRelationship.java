package rev.ca.rev_gen_lib_pers.RevDBModels;

public class RevEntityRelationship {

    private int _revResolveStatus = -1;
    private String _revType;
    private Long _revId;
    private Long _revRemoteId = -1L;
    private Long _revGUID = -1L;
    private Long _revRemoteGUID = -1L;
    private Long _revTypeValueId = -1L;
    private Long _revSubjectGUID = -1L;
    private Long _revRemoteSubjectGUID = -1L;
    private Long _revTargetGUID = -1L;
    private Long _revRemoteTargetGUID = -1L;
    private RevEntity _subjectRevEntity, _targetRevEntity;

    private Long _revTimeCreated = -1L;

    private Long _revTimePublished = -1L;
    private Long _revTimePublishedUpdated = -1L;

    public RevEntityRelationship() {
    }

    public RevEntityRelationship(String _revType, RevEntity _subjectRevEntity, RevEntity _targetRevEntity) {
        this._revType = _revType;
        this._subjectRevEntity = _subjectRevEntity;
        this._targetRevEntity = _targetRevEntity;
    }

    public RevEntityRelationship(String _revType, long _revSubjectGUID, long _revTargetGUID) {
        this._revType = _revType;
        this._revSubjectGUID = _revSubjectGUID;
        this._revTargetGUID = _revTargetGUID;
    }

    public String get_revType() {
        return _revType;
    }

    public void set_revType(String _revType) {
        this._revType = _revType;
    }

    public Long get_revId() {
        return _revId;
    }

    public void set_revId(Long _revId) {
        this._revId = _revId;
    }

    public Long get_revRemoteId() {
        return _revRemoteId;
    }

    public void set_revRemoteId(Long _revRemoteId) {
        this._revRemoteId = _revRemoteId;
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

    public Long get_revTypeValueId() {
        return _revTypeValueId;
    }

    public void set_revTypeValueId(Long _revTypeValueId) {
        this._revTypeValueId = _revTypeValueId;
    }

    public Long get_revSubjectGUID() {
        return _revSubjectGUID;
    }

    public void set_revSubjectGUID(Long _revSubjectGUID) {
        this._revSubjectGUID = _revSubjectGUID;
    }

    public Long get_revRemoteSubjectGUID() {
        return _revRemoteSubjectGUID;
    }

    public void set_revRemoteSubjectGUID(Long _revRemoteSubjectGUID) {
        this._revRemoteSubjectGUID = _revRemoteSubjectGUID;
    }

    public Long get_revTargetGUID() {
        return _revTargetGUID;
    }

    public void set_revTargetGUID(Long _revTargetGUID) {
        this._revTargetGUID = _revTargetGUID;
    }

    public Long get_revRemoteTargetGUID() {
        return _revRemoteTargetGUID;
    }

    public void set_revRemoteTargetGUID(Long _revRemoteTargetGUID) {
        this._revRemoteTargetGUID = _revRemoteTargetGUID;
    }

    public int get_revResolveStatus() {
        return _revResolveStatus;
    }

    public void set_revResolveStatus(int _revResolveStatus) {
        this._revResolveStatus = _revResolveStatus;
    }

    public RevEntity get_subjectRevEntity() {
        return _subjectRevEntity;
    }

    public void set_subjectRevEntity(RevEntity _subjectRevEntity) {
        this._subjectRevEntity = _subjectRevEntity;
    }

    public RevEntity get_targetRevEntity() {
        return _targetRevEntity;
    }

    public void set_targetRevEntity(RevEntity _targetRevEntity) {
        this._targetRevEntity = _targetRevEntity;
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
}
