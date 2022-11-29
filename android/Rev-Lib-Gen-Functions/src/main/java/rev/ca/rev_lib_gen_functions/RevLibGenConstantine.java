package rev.ca.rev_lib_gen_functions;

import android.app.Activity;
import android.content.Context;

/**
 * Created by rev on 10/28/17.
 */

public class RevLibGenConstantine {

    public static Context REV_CONTEXT;
    public static Activity REV_ACTIVITY;
    public static int REV_CONN_SOCKET;

    public static Class MAIN_ACTIVITY_CLASS;
    public static int REV_TOPBAR_HEIGHT, REV_FOOTER_HEIGHT,
            REV_IMAGE_SIZE_TINY, REV_IMAGE_SIZE_SMALL, REV_IMAGE_SIZE_MEDIUM, REV_IMAGE_SIZE_LARGE,
            REV_MARGIN_TINY, REV_MARGIN_SMALL, REV_MARGIN_MEDIUM, REV_MARGIN_LARGE,
            REV_TEXT_SIZE_TINY, REV_TEXT_SIZE_SMALL, REV_TEXT_SIZE_MEDIUM, REV_TEXT_SIZE_LARGE;

    public static int IMAGE_MAX_SIZE_LARGE, IMAGE_MAX_SIZE_MEDIUM, IMAGE_MAX_SIZE_SMALL, IMAGE_MAX_SIZE_X_SMALL, IMAGE_MAX_SIZE_TINY, IMAGE_MAX_SIZE_X_TINY;

    public static RevDimens REV_DIMENS;

    public static void setRevContext(Context revContext) {
        REV_CONTEXT = revContext;
    }

    public static void setMainActivityClass(Class mainActivityClass) {
        MAIN_ACTIVITY_CLASS = mainActivityClass;
    }

    public static void initRevLibGenConstantine() {
        // REV_ACTIVITY = (Activity) REV_CONTEXT;
        REV_DIMENS = new RevDimens(REV_CONTEXT);
        REV_TOPBAR_HEIGHT = getTopBarHeight();
        REV_FOOTER_HEIGHT = getRevFooterHeight();

        REV_MARGIN_TINY = REV_DIMENS.getRevMarginExtraSmall();
        REV_MARGIN_SMALL = REV_DIMENS.getRevMarginSmall();
        REV_MARGIN_MEDIUM = REV_DIMENS.getRevMarginMedium();
        REV_MARGIN_LARGE = REV_DIMENS.getRevMarginLarge();

        REV_IMAGE_SIZE_TINY = REV_DIMENS.getRevImageSizeExtraSmall();
        REV_IMAGE_SIZE_SMALL = REV_DIMENS.getRevImageSizeSmall();
        REV_IMAGE_SIZE_MEDIUM = REV_DIMENS.getRevImageSizeMedium();
        REV_IMAGE_SIZE_LARGE = REV_DIMENS.getRevImageSizeLarge();

        REV_TEXT_SIZE_TINY = REV_DIMENS.getRevTextSizeTiny();
        REV_TEXT_SIZE_SMALL = REV_DIMENS.getRevTextSizeSmall();
        REV_TEXT_SIZE_MEDIUM = REV_DIMENS.getRevTextSizeMedium();
        REV_TEXT_SIZE_LARGE = REV_DIMENS.getRevTextSizeLarge();


        IMAGE_MAX_SIZE_LARGE = 125000; // 1.2MP
        IMAGE_MAX_SIZE_MEDIUM = IMAGE_MAX_SIZE_LARGE / 4;
        IMAGE_MAX_SIZE_SMALL = IMAGE_MAX_SIZE_LARGE / 8;
        IMAGE_MAX_SIZE_X_SMALL = IMAGE_MAX_SIZE_LARGE / 16;
        IMAGE_MAX_SIZE_TINY = IMAGE_MAX_SIZE_LARGE / 32;
        IMAGE_MAX_SIZE_X_TINY = IMAGE_MAX_SIZE_LARGE / 64;
    }

    private static int getTopBarHeight() {
        int margin = REV_DIMENS.getRevMarginLarge();
        return (int) (margin * 1.1);
    }

    private static int getRevFooterHeight() {
        int margin = (int) (REV_DIMENS.getRevMarginMedium() * 1.4);
        return (int) (margin * 1.4);
    }
}
