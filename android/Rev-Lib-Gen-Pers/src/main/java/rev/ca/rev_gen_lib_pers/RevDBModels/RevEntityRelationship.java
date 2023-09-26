package rev.ca.rev_gen_lib_pers.RevDBModels;

public class RevEntityRelationship {

    private int _revResolveStatus = -1;
    private String _revEntityRelationshipType;
    private Long _revEntityRelationshipId;
    private Long _revRemoteEntityRelationshipId = -1L;
    private Long _revEntityGUID = -1L;
    private Long _revRemoteEntityGUID = -1L;
    private Long _revEntityRelationshipTypeValueId = -1L;
    private Long _revEntitySubjectGUID = -1L;
    private Long _revRemoteEntitySubjectGUID = -1L;
    private Long _revEntityTargetGUID = -1L;
    private Long _revRemoteEntityTargetGUID = -1L;
    private RevEntity _subjectRevEntity, _targetRevEntity;

    private Long _revTimeCreated = -1L;

    private Long _revTimePublished = -1L;
    private Long _revTimePublishedUpdated = -1L;

    public RevEntityRelationship() {
    }

    public RevEntityRelationship(String _revEntityRelationshipType, RevEntity _subjectRevEntity, RevEntity _targetRevEntity) {
        this._revEntityRelationshipType = _revEntityRelationshipType;
        this._subjectRevEntity = _subjectRevEntity;
        this._targetRevEntity = _targetRevEntity;
    }

    public RevEntityRelationship(String _revEntityRelationshipType, long _revEntitySubjectGUID, long _revEntityTargetGUID) {
        this._revEntityRelationshipType = _revEntityRelationshipType;
        this._revEntitySubjectGUID = _revEntitySubjectGUID;
        this._revEntityTargetGUID = _revEntityTargetGUID;
    }

    public String get_revEntityRelationshipType() {
        return _revEntityRelationshipType;
    }

    public void set_revEntityRelationshipType(String _revEntityRelationshipType) {
        this._revEntityRelationshipType = _revEntityRelationshipType;
    }

    public Long get_revEntityRelationshipId() {
        return _revEntityRelationshipId;
    }

    public void set_revEntityRelationshipId(Long _revEntityRelationshipId) {
        this._revEntityRelationshipId = _revEntityRelationshipId;
    }

    public Long get_revRemoteEntityRelationshipId() {
        return _revRemoteEntityRelationshipId;
    }

    public void set_revRemoteEntityRelationshipId(Long _revRemoteEntityRelationshipId) {
        this._revRemoteEntityRelationshipId = _revRemoteEntityRelationshipId;
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

    public Long get_revEntityRelationshipTypeValueId() {
        return _revEntityRelationshipTypeValueId;
    }

    public void set_revEntityRelationshipTypeValueId(Long _revEntityRelationshipTypeValueId) {
        this._revEntityRelationshipTypeValueId = _revEntityRelationshipTypeValueId;
    }

    public Long get_revEntitySubjectGUID() {
        return _revEntitySubjectGUID;
    }

    public void set_revEntitySubjectGUID(Long _revEntitySubjectGUID) {
        this._revEntitySubjectGUID = _revEntitySubjectGUID;
    }

    public Long get_revRemoteEntitySubjectGUID() {
        return _revRemoteEntitySubjectGUID;
    }

    public void set_revRemoteEntitySubjectGUID(Long _revRemoteEntitySubjectGUID) {
        this._revRemoteEntitySubjectGUID = _revRemoteEntitySubjectGUID;
    }

    public Long get_revEntityTargetGUID() {
        return _revEntityTargetGUID;
    }

    public void set_revEntityTargetGUID(Long _revEntityTargetGUID) {
        this._revEntityTargetGUID = _revEntityTargetGUID;
    }

    public Long get_revRemoteEntityTargetGUID() {
        return _revRemoteEntityTargetGUID;
    }

    public void set_revRemoteEntityTargetGUID(Long _revRemoteEntityTargetGUID) {
        this._revRemoteEntityTargetGUID = _revRemoteEntityTargetGUID;
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
