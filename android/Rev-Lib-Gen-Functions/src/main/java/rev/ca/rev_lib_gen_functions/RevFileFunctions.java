package rev.ca.rev_lib_gen_functions;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.webkit.MimeTypeMap;

import com.google.common.io.Files;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;

/**
 * Created by rev on 10/10/17.
 */

public class RevFileFunctions {

    public static File[] revFilesList(String directoryName, ArrayList<File> files) {
        File directory = new File(directoryName);

        // get all the files from a directory
        File[] fList = directory.listFiles();
        for (File file : fList) {
            if (file.isFile()) {
                files.add(file);
            } else if (file.isDirectory()) {
                revFilesList(file.getAbsolutePath(), files);
            }
        }

        return fList;
    }

    public static ArrayList<String> listAssetFiles(Context mContext, String folder) {
        ArrayList<String> assetUrls = new ArrayList<>();

        String[] list;
        try {
            list = mContext.getAssets().list(folder);
            if (list.length > 0) {
                // This is a folder
                for (String file : list) {
                    if (mContext.getAssets().list(file).length > 0) {
                        // This is also a folder. Recurse again
                        listAssetFiles(mContext, folder);
                    } else {
                        assetUrls.add(file);
                    }
                }
            }
        } catch (IOException e) {
        }

        return assetUrls;
    }

    public static int calculateInSampleSize(
            BitmapFactory.Options options, int reqWidth, int reqHeight) {
        // Raw height and width of image
        final int height = options.outHeight;
        final int width = options.outWidth;
        int inSampleSize = 1;

        if (height > reqHeight || width > reqWidth) {

            final int halfHeight = height / 2;
            final int halfWidth = width / 2;

            // Calculate the largest inSampleSize value that is a power of 2 and keeps both
            // height and width larger than the requested height and width.
            while ((halfHeight / inSampleSize) >= reqHeight
                    && (halfWidth / inSampleSize) >= reqWidth) {
                inSampleSize *= 2;
            }
        }

        return inSampleSize;
    }

    public static Bitmap decodeSampledBitmapFromResource(String absPath, int reqWidth, int reqHeight) {

        // First decode with inJustDecodeBounds=true to check dimensions
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(absPath, options);

        // Calculate inSampleSize
        options.inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight);

        // Decode bitmap with inSampleSize set
        options.inJustDecodeBounds = false;
        return BitmapFactory.decodeFile(absPath, options);
    }

    public static String REV_FILENAME_WITHOUT_EXT(String fileNameWithExt) {
        return Files.getNameWithoutExtension(fileNameWithExt);
    }

    public static String REV_FILENAME_WITH_EXT(String fileNameWithExt) {
        return new File(fileNameWithExt).getName();
    }

    public static String REV_FILE_EXT(String fileNameWithExt) {
        return Files.getFileExtension(fileNameWithExt);
    }

    public static String REV_GET_PATH_MIME_TYPE(String url) {
        String type = null;
        String extension = MimeTypeMap.getFileExtensionFromUrl(url);
        if (extension != null) {
            type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
        }
        return type;
    }

    public static boolean REV_FILE_IS_IMAGE(String imagePath) {
        if (!REV_FILE_EXISTS(imagePath)) return false;

        String revMimeType = REV_GET_PATH_MIME_TYPE(imagePath);

        return revMimeType.startsWith("image/");
    }

    public static boolean REV_FILE_EXISTS(String revFilePath) {
        return new File(revFilePath).exists();
    }

    public static boolean REV_IS_VALID_URL(String url) {
        /* Try creating a valid URL */
        try {
            new URL(url).toURI();
            return true;
        }

        // If there was an Exception
        // while creating URL object
        catch (Exception e) {
            return false;
        }
    }
}
