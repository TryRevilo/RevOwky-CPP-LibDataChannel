package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_entity;

import android.content.Context;
import android.util.Log;

import java.util.ArrayList;
import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.REV_PERS_REVMETADATA_GEN_FUNCTIONS;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevAnnotation;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityRelationship;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibCreate;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibUpdate;
import rev.ca.rev_gen_lib_pers.c_libs_core.rev_java_lib.RevPersJava;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_pers_file.RevDownloadFileFromURL;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;
import rev.ca.rev_gen_lib_pers.rev_varags_data.RevPersGenFunctions;
import rev.ca.rev_gen_lib_pers.rev_varags_data.RevVarArgsData;
import rev.ca.rev_lib_gen_functions.RevLangStrings;

public class RevDownloadUserFromServer {

    public interface IRevDownloadUserFromServer {
        void onRevDownloadUserProcessFinish(RevEntity revEntity);
    }

    private Context mContext;

    private RevEntity revPicsAlbum = null;

    private RevPersJava revPersJava = new RevPersJava();
    private RevPersLibRead revPersLibRead = new RevPersLibRead();
    private RevPersLibUpdate revPersLibUpdate = new RevPersLibUpdate();

    private long revSaveEntityPicsAlbum(RevEntity revEntity) {
        if (revEntity.get_revEntityChildrenList().isEmpty()) return -1;

        long revInfoEntityGUID = revEntity.get_revEntityGUID();
        long revInfoRemoteEntityGUID = revEntity.get_remoteRevEntityGUID();

        for (RevEntity revChildEntity : revEntity.get_revEntityChildrenList()) {
            if (revChildEntity != null && revChildEntity.get_revEntitySubType() != null && revChildEntity.get_revEntitySubType().equals("rev_pics_album")) {
                revPicsAlbum = revChildEntity;
                revPicsAlbum.set_revEntityOwnerGUID(revEntity.get_revEntityOwnerGUID());
                revPicsAlbum.set_revEntityContainerGUID(revEntity.get_revEntityGUID());
                revPicsAlbum.set_revEntityResolveStatus(0);
                break;
            }
        }

        if (revPicsAlbum == null) return -1;

        final long revPicsAlbumGUID = (long) revPersJava.saveRevEntity_NO_REMOTE_SYNC(revPicsAlbum);

        RevEntityRelationship revInfoPicAlbumRel = new RevEntityRelationship("rev_pics_album_of", revPicsAlbumGUID, revInfoEntityGUID);
        revInfoPicAlbumRel.set_revResolveStatus(0);
        revInfoPicAlbumRel.set_remoteRevEntitySubjectGUID(revPicsAlbum.get_remoteRevEntityGUID());
        revInfoPicAlbumRel.set_remoteRevEntityTargetGUID(revInfoRemoteEntityGUID);
        revPersJava.saveRevEntity_NO_REMOTE_SYNC(revInfoPicAlbumRel);

        List<RevEntity> revChildrenEntityList = revPicsAlbum.get_revEntityChildrenList();

        List<Long> revFileEntityList = new ArrayList<>();

        for (RevEntity revPicFileChildEntity : revChildrenEntityList) {
            revPicFileChildEntity.set_revEntityOwnerGUID(revPicsAlbum.get_revEntityOwnerGUID());
            long revPicFileChildEntityGUID = (long) revPersJava.saveRevEntity_NO_REMOTE_SYNC(revPicFileChildEntity);

            if (revPicFileChildEntity.get_revEntitySubType().equals("rev_file")) {
                int revFileResStatus = revPersLibUpdate.setRevEntityResolveStatusByRevEntityGUID(7, revPicFileChildEntityGUID);
                if (revFileResStatus == 1) revFileEntityList.add(revPicFileChildEntityGUID);
            }
        }

        for (final Long aLong : revFileEntityList) {
            List<RevEntityMetadata> revEntityMetadataList = revPersLibRead.revPersGetALLRevEntityMetadataByRevEntityGUID(aLong);
            String revFileName = REV_PERS_REVMETADATA_GEN_FUNCTIONS.REV_GET_METADATA_VALUE(revEntityMetadataList, "rev_file_name_value");
            String revFilePath = REV_PERS_REVMETADATA_GEN_FUNCTIONS.REV_GET_METADATA_VALUE(revEntityMetadataList, "rev_remote_file_name");

            new RevDownloadFileFromURL(mContext, new RevDownloadFileFromURL.IRevDownloadFileFromURL() {
                @Override
                public void revFileDownloadComplete(boolean output) {
                    RevEntityRelationship revInfoPicAlbumRel = new RevEntityRelationship("rev_picture_of", aLong, revPicsAlbumGUID);
                    revInfoPicAlbumRel.set_revResolveStatus(0);
                    revInfoPicAlbumRel.set_remoteRevEntitySubjectGUID(revPersLibRead.getRemoteRevEntityGUID(aLong));
                    revInfoPicAlbumRel.set_remoteRevEntityTargetGUID(revPicsAlbum.get_remoteRevEntityGUID());
                    revPersJava.saveRevEntity_NO_REMOTE_SYNC(revInfoPicAlbumRel);
                }
            }).execute(REV_SESSION_SETTINGS.getRevRemoteImageFilesRoot() + "/" + revFilePath, revFileName);
        }

        return revPicsAlbumGUID;
    }

    private void revSaveRevEntity(RevEntity revEntity) {
        if (revEntity == null) return;

        RevPersGenFunctions.REV_SET_REV_ENTITY_DATA_RES_STATUS_RESOLVED(revEntity);

        long revRemoteEntityOwnerGUID = revEntity.get_revEntityOwnerGUID();

        if (revRemoteEntityOwnerGUID > 0) {
            long revLocalEntityOwnerGUID = revPersLibRead.getLocalRevEntityGUID_By_RemoteRevEntityGUID(revRemoteEntityOwnerGUID);
            if (revLocalEntityOwnerGUID > 0) {
                revEntity.set_revEntityOwnerGUID(revLocalEntityOwnerGUID);
            } else revEntity.set_revEntityResolveStatus(-111);
        }

        long revRemoteEntityContainerGUID = revEntity.get_revEntityContainerGUID();
        if (revRemoteEntityContainerGUID > 0) {
            long revLocalEntityContainerGUID = revPersLibRead.getLocalRevEntityGUID_By_RemoteRevEntityGUID(revRemoteEntityContainerGUID);
            if (revLocalEntityContainerGUID > 0) {
                revEntity.set_revEntityContainerGUID(revLocalEntityContainerGUID);
            } else revEntity.set_revEntityResolveStatus(-111);
        }

        long revEntityGUID = revPersLibRead.getLocalRevEntityGUID_By_RemoteRevEntityGUID(revEntity.get_remoteRevEntityGUID());

        if (revEntityGUID < 0) {
            revEntityGUID = (long) revPersJava.saveRevEntity_NO_REMOTE_SYNC(revEntity);
            revEntity.set_revEntityGUID(revEntityGUID);

            this.revSaveEntityAnnotations(revEntity);
        }

        revSaveEntityPicsAlbum(revEntity);

        if (revEntityGUID < 1) return;

        RevEntity revEntityInfo = revEntity.get_revInfoEntity();

        if (revEntityInfo != null) {
            RevPersGenFunctions.REV_SET_METADATA_RESOLVED(revEntityInfo);
            revEntityInfo.set_revEntityResolveStatus(0);
            revEntityInfo.set_revEntityContainerGUID(revEntityGUID);

            long revEntityInfoGUID = (Long) revPersJava.saveRevEntity_NO_REMOTE_SYNC(revEntityInfo);
            revEntityInfo.set_revEntityGUID(revEntityInfoGUID);

            revSaveEntityPicsAlbum(revEntityInfo);
        }

        List<RevEntity> revEntityChildrenList = revEntity.get_revEntityChildrenList();

        for (RevEntity revChildEntity : revEntityChildrenList)
            this.revSaveRevEntity(revChildEntity);
    }

    private void revSaveEntityAnnotations(RevEntity revEntity) {
        RevPersLibCreate revPersLibCreate = new RevPersLibCreate();

        for (RevAnnotation revAnnotation : revEntity.get_revAnnotations()) {
            revAnnotation.set_revAnnotationResStatus(0);
            revAnnotation.set_revAnnotationName("rev_entity_like");

            long revEntityGUID = revEntity.get_revEntityGUID();
            long remoteRevEntityGUID = revEntity.get_remoteRevEntityGUID();

            if (revEntityGUID < 1 && remoteRevEntityGUID > 0) {
                revSaveRevEntity(revEntity);
                revEntityGUID = revPersLibRead.getLocalRevEntityGUID_By_RemoteRevEntityGUID(remoteRevEntityGUID);

                if (revEntityGUID < 1)
                    continue;
            }

            revAnnotation.set_revAnnotationEntityGUID(revEntityGUID);
            revAnnotation.set_revAnnOwnerEntityGUID(revPersLibRead.getLocalRevEntityGUID_By_RemoteRevEntityGUID(revAnnotation.get_revAnnRemoteOwnerEntityGUID()));

            revPersLibCreate.revPersRevEntityAnnotation(revAnnotation);
        }

        List<RevEntity> revChildrenEntityList = revEntity.get_revEntityChildrenList();

        if (revChildrenEntityList.size() > 0) {
            for (int i = 0; i < revChildrenEntityList.size(); i++) {
                revSaveEntityAnnotations(revChildrenEntityList.get(i));
            }
        }
    }

    public RevDownloadUserFromServer(final Context mContext, final String revUserName, final IRevDownloadUserFromServer iRevDownloadUserFromServer) {
        this.mContext = mContext;

        // if (RevCheckConnectivity.isIsRevNetworkConnected()) {
        //     new RevDownloadRevEntityInfoWrapper_By_UserName(mContext, revUserName, new RevDownloadRevEntityInfoWrapper_By_UserName.IRevDownloadRevEntityInfoWrapper() {
        //         @Override
        //         public void revProcessFinish(RevVarArgsData revVarArgsData) {
        //             RevPersEntityInfoWrapperModel revPersEntityInfoWrapperModel = revVarArgsData.getRevPersEntityInfoWrapperModel();

        //             if (revPersEntityInfoWrapperModel.getRevEntity() == null) return;

        //             RevEntity revEntitySingle = revPersEntityInfoWrapperModel.getRevEntity();
        //             RevPersGenFunctions.REV_SET_REV_ENTITY_DATA_RES_STATUS_RESOLVED(revEntitySingle);

        //             long revUserEntityGUID = (long) revPersJava.saveRevEntity_NO_REMOTE_SYNC(revEntitySingle);
        //             revEntitySingle.set_revEntityGUID(revUserEntityGUID);

        //             /** SAVE INFO **/

        //             if (revEntitySingle.get_revInfoEntity() != null) {
        //                 RevEntity revInfoEntity = revEntitySingle.get_revInfoEntity();

        //                 RevPersGenFunctions.REV_SET_METADATA_RESOLVED(revInfoEntity);

        //                 revInfoEntity.set_revEntityContainerGUID(revUserEntityGUID);
        //                 RevPersGenFunctions.REV_SET_REV_ENTITY_DATA_RES_STATUS_RESOLVED(revInfoEntity);
        //                 Long revInfoEntityGUID = (Long) revPersJava.saveRevEntity_NO_REMOTE_SYNC(revInfoEntity);

        //                 revInfoEntity.set_revEntityGUID(revInfoEntityGUID);

        //                 revSaveEntityPicsAlbum(revInfoEntity);
        //             }

        //             /** SAVE SOCIAL INFO **/

        //             if (revEntitySingle.get_revSocialInfoEntity() != null) {
        //                 RevEntity revSocialInfoEntity = revEntitySingle.get_revSocialInfoEntity();
        //                 RevPersGenFunctions.REV_SET_METADATA_RESOLVED(revSocialInfoEntity);

        //                 revSocialInfoEntity.set_revEntityOwnerGUID(revUserEntityGUID);
        //                 RevPersGenFunctions.REV_SET_REV_ENTITY_DATA_RES_STATUS_RESOLVED(revSocialInfoEntity);
        //                 Long revSocialInfoEntityGUID = (Long) revPersJava.saveRevEntity_NO_REMOTE_SYNC(revSocialInfoEntity);
        //                 revSocialInfoEntity.set_revEntityGUID(revSocialInfoEntityGUID);
        //             }

        //             List<RevEntity> revContainerEntities = revPersEntityInfoWrapperModel.getRevEntityContainers();
        //             for (RevEntity revContainerEntity : revContainerEntities)
        //                 revSaveRevEntity(revContainerEntity);

        //             List<RevEntity> revConnections = revPersEntityInfoWrapperModel.getRevEntityConnections();
        //             for (RevEntity revEntityConnection : revConnections)
        //                 revSaveRevEntity(revEntityConnection);

        //             List<RevEntity> revEntitySubscriptionsList = revPersEntityInfoWrapperModel.getRevEntitySubscriptionsList();
        //             for (RevEntity revEntitySubscriprionContainer : revEntitySubscriptionsList)
        //                 revSaveRevEntity(revEntitySubscriprionContainer);

        //             List<RevEntityRelationship> revEntityRelationshipList = revPersEntityInfoWrapperModel.getRevEntityRelationshipList();

        //             long remoteRevEntityGUID = revEntitySingle.get_remoteRevEntityGUID();

        //             List<RevEntity> revTimelineEntitiesList = revPersEntityInfoWrapperModel.getRevTimelineEntities();

        //             Log.v(RevLangStrings.REV_TAG, "revTimelineEntitiesList : " + revTimelineEntitiesList.size());

        //             for (RevEntity revTimelineEntity : revTimelineEntitiesList)
        //                 revSaveRevEntity(revTimelineEntity);

        //             for (RevEntityRelationship revEntityRelationship : revEntityRelationshipList) {
        //                 long revSubjectRemoteEntityGUID = revEntityRelationship.get_remoteRevEntitySubjectGUID();
        //                 long revTargetRemoteEntityGUID = revEntityRelationship.get_remoteRevEntityTargetGUID();

        //                 int revRelExists = revPersLibRead.revGetAnyRelExists_By_TypeValueId_RemoteGUIDs(revEntityRelationship.get_revEntityRelationshipType(), revSubjectRemoteEntityGUID, revTargetRemoteEntityGUID);

        //                 if (revRelExists > 0) continue;

        //                 if (revSubjectRemoteEntityGUID < 0 || revTargetRemoteEntityGUID < 0)
        //                     continue;

        //                 boolean isSubject = remoteRevEntityGUID == revSubjectRemoteEntityGUID ? true : false;

        //                 if (isSubject) {
        //                     long revEntityRelTargetGUID = revPersLibRead.getLocalRevEntityGUID_By_RemoteRevEntityGUID(revTargetRemoteEntityGUID);

        //                     if (revEntityRelTargetGUID < 1) continue;

        //                     revEntityRelationship.set_revEntitySubjectGUID(revUserEntityGUID);
        //                     revEntityRelationship.set_revEntityTargetGUID(revEntityRelTargetGUID);
        //                 } else {
        //                     long revEntityRelSubjectGUID = revPersLibRead.getLocalRevEntityGUID_By_RemoteRevEntityGUID(revSubjectRemoteEntityGUID);

        //                     if (revEntityRelSubjectGUID < 1) continue;

        //                     revEntityRelationship.set_revEntitySubjectGUID(revEntityRelSubjectGUID);
        //                     revEntityRelationship.set_revEntityTargetGUID(revUserEntityGUID);
        //                 }

        //                 if (revEntityRelationship.get_revResolveStatus() == 1)
        //                     revEntityRelationship.set_revResolveStatus(0);

        //                 revPersJava.saveRevEntity_NO_REMOTE_SYNC(revEntityRelationship);
        //             }

        //             iRevDownloadUserFromServer.onRevDownloadUserProcessFinish(revEntitySingle);
        //         }
        //     });
        // }
    }
}
