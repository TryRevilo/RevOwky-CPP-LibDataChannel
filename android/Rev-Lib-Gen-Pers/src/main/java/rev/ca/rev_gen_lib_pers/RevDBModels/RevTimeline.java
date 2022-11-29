package rev.ca.rev_gen_lib_pers.RevDBModels;

import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.rev_entity_subtypes.RevGroupEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.rev_entity_subtypes.RevObjectEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.rev_entity_subtypes.RevUserEntity;

public class RevTimeline {

    private String _revEntityType;
    private String _revEntitySubType;

    private Long _revEntityGUID = -1L;
    private Long _revEntityOwnerGUID = -1L;
    private Long _revEntityContainerGUID = -1L;

    private String _timeCreated;
    private String _timeUpdated;

    RevObjectEntity revObjectEntity;
    RevGroupEntity revGroupEntity;
    RevUserEntity revUserEntity;

    List<RevEntityMetadata> _revEntityMetadataList;

    public String get_revEntityType() {
        return _revEntityType;
    }

    public void set_revEntityType(String _revEntityType) {
        this._revEntityType = _revEntityType;
    }

    public String get_revEntitySubType() {
        return _revEntitySubType;
    }

    public void set_revEntitySubType(String _revEntitySubType) {
        this._revEntitySubType = _revEntitySubType;
    }

    public Long get_revEntityGUID() {
        return _revEntityGUID;
    }

    public void set_revEntityGUID(Long _revEntityGUID) {
        this._revEntityGUID = _revEntityGUID;
    }

    public Long get_revEntityOwnerGUID() {
        return _revEntityOwnerGUID;
    }

    public void set_revEntityOwnerGUID(Long _revEntityOwnerGUID) {
        this._revEntityOwnerGUID = _revEntityOwnerGUID;
    }

    public Long get_revEntityContainerGUID() {
        return _revEntityContainerGUID;
    }

    public void set_revEntityContainerGUID(Long _revEntityContainerGUID) {
        this._revEntityContainerGUID = _revEntityContainerGUID;
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

    public RevObjectEntity getRevObjectEntity() {
        return revObjectEntity;
    }

    public void setRevObjectEntity(RevObjectEntity revObjectEntity) {
        this.revObjectEntity = revObjectEntity;
    }

    public RevGroupEntity getRevGroupEntity() {
        return revGroupEntity;
    }

    public void setRevGroupEntity(RevGroupEntity revGroupEntity) {
        this.revGroupEntity = revGroupEntity;
    }

    public RevUserEntity getRevUserEntity() {
        return revUserEntity;
    }

    public void setRevUserEntity(RevUserEntity revUserEntity) {
        this.revUserEntity = revUserEntity;
    }

    public void set_revEntityMetadataList(List<RevEntityMetadata> _revEntityMetadataList) {
        this._revEntityMetadataList = _revEntityMetadataList;
    }
}
