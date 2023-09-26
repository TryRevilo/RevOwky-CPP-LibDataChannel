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

    private Long revMetadataId = -1L;
    private Long _revRemoteMetadataId = -1L;
    private Long revMetadataOwnerGUID = -1L;

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

    public Long getRevMetadataId() {
        return revMetadataId;
    }

    public void setRevMetadataId(Long revMetadataId) {
        this.revMetadataId = revMetadataId;
    }

    public Long getRemoteRevMetadataId() {
        return _revRemoteMetadataId;
    }

    public void setRemoteRevMetadataId(Long _revRemoteMetadataId) {
        this._revRemoteMetadataId = _revRemoteMetadataId;
    }

    public Long getRevMetadataOwnerGUID() {
        return revMetadataOwnerGUID;
    }

    public void setRevMetadataOwnerGUID(Long revMetadataOwnerGUID) {
        this.revMetadataOwnerGUID = revMetadataOwnerGUID;
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
