package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_entity;

import java.util.ArrayList;
import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityRelationship;

public class RevPersEntityInfoWrapperModel {

    private RevEntity revEntity = new RevEntity();
    private RevEntity revInfoEntity = new RevEntity();
    private RevEntity revEntitySocialInfo = new RevEntity();
    private RevEntity revEntityPicsAlbum = new RevEntity();

    private List<RevEntity> revChildrenEntityList = new ArrayList<>();

    private List<RevEntity> revEntityContainers = new ArrayList<>();

    private List<RevEntity> revEntityConnections = new ArrayList<>();

    private List<RevEntity> revEntitySubscriptionsList = new ArrayList<>();

    private List<RevEntity> revTimelineEntities = new ArrayList<>();

    private List<RevEntityRelationship> revEntityRelationshipList = new ArrayList<>();

    public RevEntity getRevEntity() {
        return revEntity;
    }

    public void setRevEntity(RevEntity revEntity) {
        this.revEntity = revEntity;
    }

    public RevEntity getRevInfoEntity() {
        return revInfoEntity;
    }

    public void setRevInfoEntity(RevEntity revInfoEntity) {
        this.revInfoEntity = revInfoEntity;
    }

    public RevEntity getRevEntitySocialInfo() {
        return revEntitySocialInfo;
    }

    public void setRevEntitySocialInfo(RevEntity revEntitySocialInfo) {
        this.revEntitySocialInfo = revEntitySocialInfo;
    }

    public RevEntity getRevEntityPicsAlbum() {
        return revEntityPicsAlbum;
    }

    public void setRevEntityPicsAlbum(RevEntity revEntityPicsAlbum) {
        this.revEntityPicsAlbum = revEntityPicsAlbum;
    }

    public List<RevEntity> getRevChildrenEntityList() {
        return revChildrenEntityList;
    }

    public void setRevChildrenEntityList(List<RevEntity> revChildrenEntityList) {
        this.revChildrenEntityList = revChildrenEntityList;
    }

    public List<RevEntity> getRevEntityContainers() {
        return revEntityContainers;
    }

    public void setRevEntityContainers(List<RevEntity> revEntityContainers) {
        this.revEntityContainers = revEntityContainers;
    }

    public List<RevEntity> getRevEntityConnections() {
        return revEntityConnections;
    }

    public void setRevEntityConnections(List<RevEntity> revEntityConnections) {
        this.revEntityConnections = revEntityConnections;
    }

    public List<RevEntity> getRevEntitySubscriptionsList() {
        return revEntitySubscriptionsList;
    }

    public void setRevEntitySubscriptionsList(List<RevEntity> revEntitySubscriptionsList) {
        this.revEntitySubscriptionsList = revEntitySubscriptionsList;
    }

    public List<RevEntity> getRevTimelineEntities() {
        return revTimelineEntities;
    }

    public void setRevTimelineEntities(List<RevEntity> revTimelineEntities) {
        this.revTimelineEntities = revTimelineEntities;
    }

    public List<RevEntityRelationship> getRevEntityRelationshipList() {
        return revEntityRelationshipList;
    }

    public void setRevEntityRelationshipList(List<RevEntityRelationship> revEntityRelationshipList) {
        this.revEntityRelationshipList = revEntityRelationshipList;
    }
}
