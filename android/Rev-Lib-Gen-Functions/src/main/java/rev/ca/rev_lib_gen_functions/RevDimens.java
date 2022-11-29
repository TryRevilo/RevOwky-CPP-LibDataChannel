package rev.ca.rev_lib_gen_functions;

import android.content.Context;

/**
 * Created by rev on 10/26/17.
 */

public class RevDimens {

    private Context mContext;

    private int revSize5, revSize10,
            pageWidth, pageHeight, revButtonHeightSmall,
            revRelativeMargin_WIDTH, revRelativeMargin_HEIGHT,
            revMargintiny, revMarginExtraSmall, revMarginSmall, revMarginMedium, revMarginLarge,
            revImageSizeExtraSmall, revImageSizeSmall, revImageSizeMedium, revImageSizeLarge,
            revTextSizeTiny, revTextSizeSmall, revTextSizeMedium, revTextSizeLarge;

    public RevDimens(Context _mContext) {
        this.mContext = _mContext;

        revSize5 = mContext.getResources().getDimensionPixelSize(R.dimen.rev_size_5);
        revSize10 = mContext.getResources().getDimensionPixelSize(R.dimen.rev_size_10);

        pageWidth = RevViewsBaseFunctions.getRevCoreAppPageWidth();
        pageHeight = RevViewsBaseFunctions.getRevCoreAppPageHeight();

        revButtonHeightSmall = mContext.getResources().getDimensionPixelSize(R.dimen.rev_button_H_size_small);

        revRelativeMargin_WIDTH = (int) (pageWidth * .08);
        revRelativeMargin_HEIGHT = (int) (pageHeight * .08);

        revMargintiny = mContext.getResources().getDimensionPixelSize(R.dimen.rev_activity_margin_tiny);
        revMarginExtraSmall = mContext.getResources().getDimensionPixelSize(R.dimen.rev_activity_margin_extra_small);
        revMarginSmall = mContext.getResources().getDimensionPixelSize(R.dimen.rev_activity_margin_small);
        revMarginMedium = mContext.getResources().getDimensionPixelSize(R.dimen.rev_activity_margin_medium);
        revMarginLarge = mContext.getResources().getDimensionPixelSize(R.dimen.rev_activity_margin_large);

        revImageSizeExtraSmall = mContext.getResources().getDimensionPixelSize(R.dimen.rev_core_views_image_size_extra_small);
        revImageSizeSmall = mContext.getResources().getDimensionPixelSize(R.dimen.rev_core_views_image_size_small);
        revImageSizeMedium = mContext.getResources().getDimensionPixelSize(R.dimen.rev_core_views__image_size_mid);
        revImageSizeLarge = mContext.getResources().getDimensionPixelSize(R.dimen.rev_core_views__image_size_large);

        revTextSizeTiny = mContext.getResources().getDimensionPixelSize(R.dimen.font_size_extra_small);
        revTextSizeSmall = mContext.getResources().getDimensionPixelSize(R.dimen.font_size_small);
        revTextSizeMedium = mContext.getResources().getDimensionPixelSize(R.dimen.font_size_medium);
        revTextSizeLarge = mContext.getResources().getDimensionPixelSize(R.dimen.font_size_large);
    }

    public int getRevSize5() {
        return revSize5;
    }

    public int getRevSize10() {
        return revSize10;
    }

    public int getPageWidth() {
        return pageWidth;
    }

    public int getPageHeight() {
        return pageHeight;
    }

    public int getRevButtonHeightSmall() {
        return revButtonHeightSmall;
    }

    public int getRevRelativeMargin_WIDTH() {
        return revRelativeMargin_WIDTH;
    }

    public int getRevRelativeMargin_HEIGHT() {
        return revRelativeMargin_HEIGHT;
    }

    public int getRevMargintiny() {
        return revMargintiny;
    }

    public int getRevMarginExtraSmall() {
        return revMarginExtraSmall;
    }

    public int getRevMarginSmall() {
        return revMarginSmall;
    }

    public int getRevMarginMedium() {
        return revMarginMedium;
    }

    public int getRevMarginLarge() {
        return revMarginLarge;
    }

    public int getRevImageSizeExtraSmall() {
        return revImageSizeExtraSmall;
    }

    public int getRevImageSizeSmall() {
        return revImageSizeSmall;
    }

    public int getRevImageSizeMedium() {
        return revImageSizeMedium;
    }

    public int getRevImageSizeLarge() {
        return revImageSizeLarge;
    }

    public int getRevTextSizeTiny() {
        return revTextSizeTiny;
    }

    public int getRevTextSizeSmall() {
        return revTextSizeSmall;
    }

    public int getRevTextSizeMedium() {
        return revTextSizeMedium;
    }

    public int getRevTextSizeLarge() {
        return revTextSizeLarge;
    }
}
