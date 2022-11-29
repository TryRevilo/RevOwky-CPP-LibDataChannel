package rev.ca.rev_gen_lib_pers.rev_varags_data;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_lib_gen_functions.RevLibGenConstantine;

/**
 * Created by rev on 10/9/17.
 */

public class REV_SESSION_SETTINGS {

    private static RevVarArgsData REV_LOGGED_IN_PAGE_REV_VAR_ARGS_DATA;

    private static RevVarArgsData REV_CURRENT_PAGE_REV_VAR_ARGS_DATA;

    private static RevEntity REV_CURRENT_PAGE_OWNER_ENTITY;

    private static Long REV_LOGGED_IN_ENTITY_GUID = -1L;
    private static Long REV_LOGGED_IN_REMOTE_ENTITY_GUID = -1L;
    private static Long revEntitySiteGUID = -1L;

    private static boolean IS_NOT_LOGGED_IN = true;

    private static String revServerIPAddress, revRemoteServer, revRemoteImageFilesRoot;

    public static void revLogOut() {
        setRevLoggedInEntityGuid(-1l);
        setRevEntitySiteGUID(-1l);
        setIsNotLoggedIn(true);

        REV_RELOAD_MAIN_APP_ACTIVITY();
    }

    public static void REV_RELOAD_MAIN_APP_ACTIVITY() {
        Context mContext = RevLibGenConstantine.REV_CONTEXT;
        Activity mActivity = (Activity) mContext;
        mActivity.finish();

        Intent refresh = new Intent(mContext, RevLibGenConstantine.MAIN_ACTIVITY_CLASS);
        mContext.startActivity(refresh);
    }

    public static RevVarArgsData getRevLoggedInPageRevVarArgsData() {
        return REV_LOGGED_IN_PAGE_REV_VAR_ARGS_DATA;
    }

    public static void setRevLoggedInPageRevVarArgsData(RevVarArgsData revLoggedInPageRevVarArgsData) {
        REV_LOGGED_IN_PAGE_REV_VAR_ARGS_DATA = revLoggedInPageRevVarArgsData;
    }

    public static RevVarArgsData getRevCurrentPageRevVarArgsData() {
        return REV_CURRENT_PAGE_REV_VAR_ARGS_DATA;
    }

    public static void setRevCurrentPageRevVarArgsData(RevVarArgsData revCurrentPageRevVarArgsData) {
        REV_CURRENT_PAGE_REV_VAR_ARGS_DATA = revCurrentPageRevVarArgsData;
    }

    public static RevEntity getRevCurrentPageOwnerEntity() {
        return REV_CURRENT_PAGE_OWNER_ENTITY;
    }

    public static void setRevCurrentPageOwnerEntity(RevEntity revCurrentPageOwnerEntity) {
        REV_CURRENT_PAGE_OWNER_ENTITY = revCurrentPageOwnerEntity;
    }

    public static Long getRevLoggedInEntityGuid() {
        return REV_LOGGED_IN_ENTITY_GUID;
    }

    public static void setRevLoggedInEntityGuid(Long revLoggedInEntityGuid) {
        REV_LOGGED_IN_ENTITY_GUID = revLoggedInEntityGuid;
    }

    public static Long getRevLoggedInRemoteEntityGuid() {
        return REV_LOGGED_IN_REMOTE_ENTITY_GUID;
    }

    public static void setRevLoggedInRemoteEntityGuid(Long revLoggedInRemoteEntityGuid) {
        REV_LOGGED_IN_REMOTE_ENTITY_GUID = revLoggedInRemoteEntityGuid;
    }

    public static Long getRevEntitySiteGUID() {
        return revEntitySiteGUID;
    }

    public static void setRevEntitySiteGUID(Long revEntitySiteGUID) {
        REV_SESSION_SETTINGS.revEntitySiteGUID = revEntitySiteGUID;
    }

    public static boolean isIsNotLoggedIn() {
        return IS_NOT_LOGGED_IN;
    }

    public static void setIsNotLoggedIn(boolean isNotLoggedIn) {
        IS_NOT_LOGGED_IN = isNotLoggedIn;
    }

    public static String getRevServerIPAddress() {
        return revServerIPAddress;
    }

    public static void setRevServerIPAddress(String revServerIPAddress) {
        REV_SESSION_SETTINGS.revServerIPAddress = revServerIPAddress;
    }

    public static String getRevRemoteServer() {
        return revRemoteServer;
    }

    public static void setRevRemoteServer(String revRemoteServer) {
        REV_SESSION_SETTINGS.revRemoteServer = revRemoteServer;
    }

    public static String getRevRemoteImageFilesRoot() {
        return revRemoteImageFilesRoot;
    }

    public static void setRevRemoteImageFilesRoot(String revRemoteImageFilesRoot) {
        REV_SESSION_SETTINGS.revRemoteImageFilesRoot = revRemoteImageFilesRoot;
    }
}
