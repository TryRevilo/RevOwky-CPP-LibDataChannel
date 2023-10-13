package rev.ca.rev_gen_lib_pers.RevDBModels;

/**
 * Created by rev on 2/12/18.
 */

public class RevAnnotation {

    int _revResolveStatus;

    private String _revName, _revValue;
    private Long _revId, _revRemoteId, _revGUID, _revRemoteGUID,
            _revOwnerGUID, _revRemoteOwnerGUID, _revTimeCreated, _revTimePublished,
            _revTimePublishedUpdated = -1L;

    public RevAnnotation() {
        _revId = _revRemoteId = _revOwnerGUID = _revGUID = _revRemoteOwnerGUID = _revRemoteGUID = -1L;
    }

    public int get_revResolveStatus() {
        return _revResolveStatus;
    }

    public void set_revResolveStatus(int _revResolveStatus) {
        this._revResolveStatus = _revResolveStatus;
    }

    public String get_revName() {
        return _revName;
    }

    public void set_revName(String _revName) {
        this._revName = _revName;
    }

    public String get_revValue() {
        return _revValue;
    }

    public void set_revValue(String _revValue) {
        this._revValue = _revValue;
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

    public Long get_revOwnerGUID() {
        return _revOwnerGUID;
    }

    public void set_revOwnerGUID(Long _revOwnerGUID) {
        this._revOwnerGUID = _revOwnerGUID;
    }

    public Long get_revRemoteOwnerGUID() {
        return _revRemoteOwnerGUID;
    }

    public void set_revRemoteOwnerGUID(Long _revRemoteOwnerGUID) {
        this._revRemoteOwnerGUID = _revRemoteOwnerGUID;
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
