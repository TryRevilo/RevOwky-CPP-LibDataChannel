package rev.ca.rev_gen_lib_pers.RevDBModels;

public class RevEntityRelationship {

    private int _revResolveStatus = -1;
    private String _revEntityRelationshipType;
    private Long _revEntityRelationshipId;
    private Long _remoteRevEntityRelationshipId = -1L;
    private Long _revEntityGUID = -1L;
    private Long _remoteRevEntityGUID = -1L;
    private Long _revEntityRelationshipTypeValueId = -1L;
    private Long _revEntitySubjectGUID = -1L;
    private Long _remoteRevEntitySubjectGUID = -1L;
    private Long _revEntityTargetGUID = -1L;
    private Long _remoteRevEntityTargetGUID = -1L;
    private String _timeCreated;
    private String _timeUpdated;
    private RevEntity _subjectRevEntity, _targetRevEntity;

    private long _revTimeCreated = -1;

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

    public Long get_remoteRevEntityRelationshipId() {
        return _remoteRevEntityRelationshipId;
    }

    public void set_remoteRevEntityRelationshipId(Long _remoteRevEntityRelationshipId) {
        this._remoteRevEntityRelationshipId = _remoteRevEntityRelationshipId;
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

    public Long get_remoteRevEntitySubjectGUID() {
        return _remoteRevEntitySubjectGUID;
    }

    public void set_remoteRevEntitySubjectGUID(Long _remoteRevEntitySubjectGUID) {
        this._remoteRevEntitySubjectGUID = _remoteRevEntitySubjectGUID;
    }

    public Long get_revEntityTargetGUID() {
        return _revEntityTargetGUID;
    }

    public void set_revEntityTargetGUID(Long _revEntityTargetGUID) {
        this._revEntityTargetGUID = _revEntityTargetGUID;
    }

    public Long get_remoteRevEntityTargetGUID() {
        return _remoteRevEntityTargetGUID;
    }

    public void set_remoteRevEntityTargetGUID(Long _remoteRevEntityTargetGUID) {
        this._remoteRevEntityTargetGUID = _remoteRevEntityTargetGUID;
    }

    public int get_revResolveStatus() {
        return _revResolveStatus;
    }

    public void set_revResolveStatus(int _revResolveStatus) {
        this._revResolveStatus = _revResolveStatus;
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

    public long get_revTimeCreated() {
        return _revTimeCreated;
    }

    public void set_revTimeCreated(long _revTimeCreated) {
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
