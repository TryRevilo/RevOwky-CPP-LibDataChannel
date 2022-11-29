package rev.ca.rev_gen_lib_pers.rev_varags_data;

import android.os.Environment;

import java.io.File;

/**
 * Created by rev on 1/29/18.
 */

public class RevPersConstantine {

    public static Long REV_LOGGED_IN_ENTITY_GUID;
    public static Long REV_SITE_ENTITY_GUID;

    public static void initRevPersConstantine() {
        REV_LOGGED_IN_ENTITY_GUID = REV_SESSION_SETTINGS.getRevLoggedInEntityGuid();
        REV_SITE_ENTITY_GUID = REV_SESSION_SETTINGS.getRevEntitySiteGUID();
    }

    public static String revAppRootDirPath;
    public static String revBaseAppDirPath;

    // Images
    public static String revBaseUserImagesDirPath, revBaseUserImagesLargeDirPath, revBaseUserImagesMediumDirPath, revBaseUserImagesSmallDirPath, revBaseUserImages_X_SmallDirPath;

    public static void REV_INIT_DIRS() {
        revAppRootDirPath = Environment.DIRECTORY_DOWNLOADS;
        String revExtPathRoot = Environment.getExternalStoragePublicDirectory(revAppRootDirPath).getAbsolutePath();

        revBaseAppDirPath = revExtPathRoot + "/rev_app";
        revBaseUserImagesDirPath = revBaseAppDirPath + "/rev_user_images";

        revBaseUserImagesLargeDirPath = revBaseUserImagesDirPath + "/rev_large";
        revBaseUserImagesMediumDirPath = revBaseUserImagesDirPath + "/rev_medium";
        revBaseUserImagesSmallDirPath = revBaseUserImagesDirPath + "/rev_small";
        revBaseUserImages_X_SmallDirPath = revBaseUserImagesDirPath + "/rev_x_small";

        File revBaseUserImagesLargeDir = new File(revBaseUserImagesLargeDirPath);
        File revBaseUserImagesMediumDir = new File(revBaseUserImagesMediumDirPath);
        File revBaseUserImagesSmallDir = new File(revBaseUserImagesSmallDirPath);
        File revBaseUserImages_X_SmallDir = new File(revBaseUserImages_X_SmallDirPath);

        revBaseUserImagesLargeDir.mkdirs();
        revBaseUserImagesMediumDir.mkdirs();
        revBaseUserImagesSmallDir.mkdirs();
        revBaseUserImages_X_SmallDir.mkdirs();
    }

    public static int GET_REV_REL_ID(String revRelString) {
        int relTypeValId;

        switch (revRelString) {
            case "rev_timeline_entry":
                relTypeValId = 1;
                break;
            case "kiwi_of":
                relTypeValId = 2;
                break;
            case "rev_pics_album_of":
                relTypeValId = 3;
                break;
            case "rev_picture_of":
                relTypeValId = 4;
                break;
            case "rev_entity_connect_members":
                relTypeValId = 5;
                break;
            case "rev_comment":
                relTypeValId = 6;
                break;
            case "rev_entity_space_member":
                relTypeValId = 7;
                break;
            default:
                relTypeValId = 0;
        }

        return relTypeValId;
    }
}
