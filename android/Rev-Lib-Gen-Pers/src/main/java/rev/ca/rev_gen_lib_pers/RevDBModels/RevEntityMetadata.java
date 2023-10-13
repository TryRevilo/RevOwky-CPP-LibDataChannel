package rev.ca.rev_gen_lib_pers.RevDBModels;

/**
 * Created by rev on 12/20/17.
 */

public class RevEntityMetadata {
    public int get_revResolveStatus() {
        return _revResolveStatus;
    }

    public void set_revResolveStatus(int _revResolveStatus) {
        this._revResolveStatus = _revResolveStatus;
    }

    private int _revResolveStatus = -1;
    private String _revName, _revValue;
    private Long _revId = -1L;
    private Long _revRemoteId = -1L;
    private Long _revGUID = -1L;
    private Long _revTimeCreated = -1L;
    private Long _revTimePublished = -1L;
    private Long _revTimePublishedUpdated = -1L;

    public RevEntityMetadata() {
    }

    public RevEntityMetadata(String _revName, String _revValue) {
        this._revName = _revName;
        this._revValue = _revValue;
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

    public Long getRemote_revId() {
        return _revRemoteId;
    }

    public void setRemote_revId(Long _revRemoteId) {
        this._revRemoteId = _revRemoteId;
    }

    public Long get_revMetadataOwnerGUID() {
        return _revGUID;
    }

    public void set_revMetadataOwnerGUID(Long _revGUID) {
        this._revGUID = _revGUID;
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
