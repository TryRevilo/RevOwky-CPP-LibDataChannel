package rev.ca.rev_gen_lib_pers.RevDBModels;

/**
 * Created by rev on 12/23/17.
 */

public class RevEntityMetastrings {

    private long id;
    private String value;

    private long _revTimeCreated = -1;
    private long _revTimePublished = -1;
    private long _revTimePublishedUpdated = -1;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
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
