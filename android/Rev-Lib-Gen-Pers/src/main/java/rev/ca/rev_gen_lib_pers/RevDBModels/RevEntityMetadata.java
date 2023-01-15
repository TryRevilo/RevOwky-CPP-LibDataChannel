package rev.ca.rev_gen_lib_pers.RevDBModels;

/**
 * Created by rev on 12/20/17.
 */

public class RevEntityMetadata {

    public int get_resolveStatus() {
        return _resolveStatus;
    }

    public void set_resolveStatus(int _resolveStatus) {
        this._resolveStatus = _resolveStatus;
    }

    private int _resolveStatus = -1;

    private String _revMetadataName, _metadataValue;

    private Long revMetadataId = -1L;
    private Long remoteRevMetadataId = -1L;
    private Long revMetadataOwnerGUID = -1L;
    private Long revMetadataValueId = -1L;

    private String _timeCreated;
    private String _timeUpdated;

    private long _revTimeCreated = -1;
    private long _revTimePublished = -1;
    private long _revTimePublishedUpdated = -1;

    public RevEntityMetadata() {
    }

    public RevEntityMetadata(String _revMetadataName, String _metadataValue) {
        this._revMetadataName = _revMetadataName;
        this._metadataValue = _metadataValue;
    }

    public String get_revMetadataName() {
        return _revMetadataName;
    }

    public void set_revMetadataName(String _revMetadataName) {
        this._revMetadataName = _revMetadataName;
    }

    public String get_metadataValue() {
        return _metadataValue;
    }

    public void set_metadataValue(String _metadataValue) {
        this._metadataValue = _metadataValue;
    }

    public Long getRevMetadataId() {
        return revMetadataId;
    }

    public void setRevMetadataId(Long revMetadataId) {
        this.revMetadataId = revMetadataId;
    }

    public Long getRemoteRevMetadataId() {
        return remoteRevMetadataId;
    }

    public void setRemoteRevMetadataId(Long remoteRevMetadataId) {
        this.remoteRevMetadataId = remoteRevMetadataId;
    }

    public Long getRevMetadataOwnerGUID() {
        return revMetadataOwnerGUID;
    }

    public void setRevMetadataOwnerGUID(Long revMetadataOwnerGUID) {
        this.revMetadataOwnerGUID = revMetadataOwnerGUID;
    }

    public Long getRevMetadataValueId() {
        return revMetadataValueId;
    }

    public void setRevMetadataValueId(Long revMetadataValueId) {
        this.revMetadataValueId = revMetadataValueId;
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
