package rev.ca.rev_gen_lib_pers.RevDBModels.rev_entity_subtypes;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;

public class RevObjectEntity extends RevEntity {
    public RevObjectEntity() {
    }

    private String _revObjectName = "";
    private String _revObjectDescription = "";

    public String get_revObjectName() {
        return _revObjectName;
    }

    public void set_revObjectName(String _revObjectName) {
        this._revObjectName = _revObjectName;
    }

    public String get_revObjectDescription() {
        return _revObjectDescription;
    }

    public void set_revObjectDescription(String _revObjectDescription) {
        this._revObjectDescription = _revObjectDescription;
    }
}
