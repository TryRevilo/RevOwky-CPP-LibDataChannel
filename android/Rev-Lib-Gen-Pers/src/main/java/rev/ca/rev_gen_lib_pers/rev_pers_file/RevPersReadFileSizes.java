package rev.ca.rev_gen_lib_pers.rev_pers_file;

import rev.ca.rev_lib_gen_functions.RevFileFunctions;
import rev.ca.rev_lib_gen_functions.RevLibGenConstantine;
import rev.ca.rev_gen_lib_pers.rev_varags_data.RevPersConstantine;

public class RevPersReadFileSizes {

    public String revResizeImage(String revImgPath, int revImageSize) {
        if (revImageSize == RevLibGenConstantine.IMAGE_MAX_SIZE_LARGE) {
            return RevPersConstantine.revBaseUserImagesLargeDirPath + "/" + RevFileFunctions.REV_FILENAME_WITH_EXT(revImgPath);

        } else if (revImageSize == RevLibGenConstantine.IMAGE_MAX_SIZE_X_SMALL) {
            return RevPersConstantine.revBaseUserImages_X_SmallDirPath + "/" + RevFileFunctions.REV_FILENAME_WITH_EXT(revImgPath);

        } else if (revImageSize == RevLibGenConstantine.IMAGE_MAX_SIZE_SMALL) {
            return RevPersConstantine.revBaseUserImagesSmallDirPath + "/" + RevFileFunctions.REV_FILENAME_WITH_EXT(revImgPath);

        } else if (revImageSize == RevLibGenConstantine.IMAGE_MAX_SIZE_MEDIUM) {
            return RevPersConstantine.revBaseUserImagesMediumDirPath + "/" + RevFileFunctions.REV_FILENAME_WITH_EXT(revImgPath);

        }

        return revImgPath;
    }
}
