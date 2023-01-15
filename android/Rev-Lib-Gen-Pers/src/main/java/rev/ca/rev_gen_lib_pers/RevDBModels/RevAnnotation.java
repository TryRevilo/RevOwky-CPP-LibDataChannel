package rev.ca.rev_gen_lib_pers.RevDBModels;

/**
 * Created by rev on 2/12/18.
 */

public class RevAnnotation {


    int _revAnnotationResStatus, _revAnnotationNameId;

    private String _revAnnotationName, _revAnnotationValue, _revAnnotationTimeCreated, _revAnnotationTimeUpdated;
    private Long _revAnnotationId, _revAnnotationRemoteId, _revAnnotationEntityGUID, _revAnnotationRemoteEntityGUID, _revAnnOwnerEntityGUID, _revAnnRemoteOwnerEntityGUID;

    private long _revTimeCreated = -1;
    private long _revTimePublished = -1;
    private long _revTimePublishedUpdated = -1;

    public RevAnnotation() {
        _revAnnotationResStatus = _revAnnotationNameId = -1;
        _revAnnotationId = _revAnnotationRemoteId = _revAnnOwnerEntityGUID = _revAnnotationEntityGUID = _revAnnRemoteOwnerEntityGUID = _revAnnotationRemoteEntityGUID = -1L;
    }

    public int get_revAnnotationResStatus() {
        return _revAnnotationResStatus;
    }

    public void set_revAnnotationResStatus(int _revAnnotationResStatus) {
        this._revAnnotationResStatus = _revAnnotationResStatus;
    }

    public int get_revAnnotationNameId() {
        return _revAnnotationNameId;
    }

    public void set_revAnnotationNameId(int _revAnnotationNameId) {
        this._revAnnotationNameId = _revAnnotationNameId;
    }

    public String get_revAnnotationName() {
        return _revAnnotationName;
    }

    public void set_revAnnotationName(String _revAnnotationName) {
        this._revAnnotationName = _revAnnotationName;
    }

    public String get_revAnnotationValue() {
        return _revAnnotationValue;
    }

    public void set_revAnnotationValue(String _revAnnotationValue) {
        this._revAnnotationValue = _revAnnotationValue;
    }

    public String get_revAnnotationTimeCreated() {
        return _revAnnotationTimeCreated;
    }

    public void set_revAnnotationTimeCreated(String _revAnnotationTimeCreated) {
        this._revAnnotationTimeCreated = _revAnnotationTimeCreated;
    }

    public String get_revAnnotationTimeUpdated() {
        return _revAnnotationTimeUpdated;
    }

    public void set_revAnnotationTimeUpdated(String _revAnnotationTimeUpdated) {
        this._revAnnotationTimeUpdated = _revAnnotationTimeUpdated;
    }

    public Long get_revAnnotationId() {
        return _revAnnotationId;
    }

    public void set_revAnnotationId(Long _revAnnotationId) {
        this._revAnnotationId = _revAnnotationId;
    }

    public Long get_revAnnotationRemoteId() {
        return _revAnnotationRemoteId;
    }

    public void set_revAnnotationRemoteId(Long _revAnnotationRemoteId) {
        this._revAnnotationRemoteId = _revAnnotationRemoteId;
    }

    public Long get_revAnnotationEntityGUID() {
        return _revAnnotationEntityGUID;
    }

    public void set_revAnnotationEntityGUID(Long _revAnnotationEntityGUID) {
        this._revAnnotationEntityGUID = _revAnnotationEntityGUID;
    }

    public Long get_revAnnotationRemoteEntityGUID() {
        return _revAnnotationRemoteEntityGUID;
    }

    public void set_revAnnotationRemoteEntityGUID(Long _revAnnotationRemoteEntityGUID) {
        this._revAnnotationRemoteEntityGUID = _revAnnotationRemoteEntityGUID;
    }

    public Long get_revAnnOwnerEntityGUID() {
        return _revAnnOwnerEntityGUID;
    }

    public void set_revAnnOwnerEntityGUID(Long _revAnnOwnerEntityGUID) {
        this._revAnnOwnerEntityGUID = _revAnnOwnerEntityGUID;
    }

    public Long get_revAnnRemoteOwnerEntityGUID() {
        return _revAnnRemoteOwnerEntityGUID;
    }

    public void set_revAnnRemoteOwnerEntityGUID(Long _revAnnRemoteOwnerEntityGUID) {
        this._revAnnRemoteOwnerEntityGUID = _revAnnRemoteOwnerEntityGUID;
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
}
