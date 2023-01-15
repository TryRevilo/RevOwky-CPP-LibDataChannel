package rev.ca.rev_gen_lib_pers.rev_pers_file;

import android.graphics.Bitmap;

import rev.ca.rev_lib_gen_functions.RevFileFunctions;
import rev.ca.rev_lib_gen_functions.RevLibGenConstantine;
import rev.ca.rev_gen_lib_pers.rev_varags_data.RevPersConstantine;

public class RevResizeFileSizes {

    private String revImgPath;
    private int revImageSize;

    Bitmap bitmap;
    int revWriteState;

    public RevResizeFileSizes(String revImgPath, int revImageSize) {
        this.revImgPath = revImgPath;
        this.revImageSize = revImageSize;
    }

    public int revResizeImage() {
        if (revImageSize == RevLibGenConstantine.IMAGE_MAX_SIZE_LARGE) {
            bitmap = revGetResizedBitmap(revImgPath, RevLibGenConstantine.IMAGE_MAX_SIZE_LARGE);
            revWriteState = revWriteBitmapToFile(bitmap, RevPersConstantine.revBaseUserImagesLargeDirPath);

        } else if (revImageSize == RevLibGenConstantine.IMAGE_MAX_SIZE_X_SMALL) {
            bitmap = revGetResizedBitmap(revImgPath, RevLibGenConstantine.IMAGE_MAX_SIZE_X_SMALL);
            revWriteState = revWriteBitmapToFile(bitmap, RevPersConstantine.revBaseUserImages_X_SmallDirPath);

        } else if (revImageSize == RevLibGenConstantine.IMAGE_MAX_SIZE_SMALL) {
            bitmap = revGetResizedBitmap(revImgPath, RevLibGenConstantine.IMAGE_MAX_SIZE_SMALL);
            revWriteState = revWriteBitmapToFile(bitmap, RevPersConstantine.revBaseUserImagesSmallDirPath);

        } else if (revImageSize == RevLibGenConstantine.IMAGE_MAX_SIZE_MEDIUM) {
            bitmap = revGetResizedBitmap(revImgPath, RevLibGenConstantine.IMAGE_MAX_SIZE_MEDIUM);
            revWriteState = revWriteBitmapToFile(bitmap, RevPersConstantine.revBaseUserImagesMediumDirPath);

        }

        return revWriteState;
    }

    public Bitmap revGetResizedBitmap(String revImgPath, int revMaxImageSize) {
        return new RevResizeImageFile(RevLibGenConstantine.REV_CONTEXT).revResizeBitmapImage(revImgPath, revMaxImageSize);
    }

    public int revWriteBitmapToFile(Bitmap bitmap, String revStoragePath) {
        return new RevResizeImageFile(RevLibGenConstantine.REV_CONTEXT).writeBitmapToFile(bitmap, revStoragePath + "/" + RevFileFunctions.REV_FILENAME_WITH_EXT(revImgPath));
    }

}
