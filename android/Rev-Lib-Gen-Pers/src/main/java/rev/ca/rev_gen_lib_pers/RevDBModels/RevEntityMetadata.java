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
    private String _revMetadataName, _revMetadataValue;
    private Long _revMetadataId = -1L;
    private Long _revRemoteMetadataId = -1L;
    private Long _revEntityGUID = -1L;
    private Long _revTimeCreated = -1L;
    private Long _revTimePublished = -1L;
    private Long _revTimePublishedUpdated = -1L;

    public RevEntityMetadata() {
    }

    public RevEntityMetadata(String _revMetadataName, String _revMetadataValue) {
        this._revMetadataName = _revMetadataName;
        this._revMetadataValue = _revMetadataValue;
    }

    public String get_revMetadataName() {
        return _revMetadataName;
    }

    public void set_revMetadataName(String _revMetadataName) {
        this._revMetadataName = _revMetadataName;
    }

    public String get_revMetadataValue() {
        return _revMetadataValue;
    }

    public void set_revMetadataValue(String _revMetadataValue) {
        this._revMetadataValue = _revMetadataValue;
    }

    public Long get_revMetadataId() {
        return _revMetadataId;
    }

    public void set_revMetadataId(Long _revMetadataId) {
        this._revMetadataId = _revMetadataId;
    }

    public Long getRemote_revMetadataId() {
        return _revRemoteMetadataId;
    }

    public void setRemote_revMetadataId(Long _revRemoteMetadataId) {
        this._revRemoteMetadataId = _revRemoteMetadataId;
    }

    public Long get_revMetadataOwnerGUID() {
        return _revEntityGUID;
    }

    public void set_revMetadataOwnerGUID(Long _revEntityGUID) {
        this._revEntityGUID = _revEntityGUID;
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
