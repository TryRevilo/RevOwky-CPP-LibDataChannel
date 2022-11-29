package rev.ca.rev_gen_lib_pers.rev_pers_file;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class RevResizeImageFile {

    private Context mContext;

    public RevResizeImageFile(Context mContext) {
        this.mContext = mContext;
    }

    public int writeBitmapToFile(Bitmap b, String revDestPath) {
        if (b == null) return -2;

        FileOutputStream fOut;
        try {
            fOut = new FileOutputStream(new File(revDestPath));
            b.compress(Bitmap.CompressFormat.PNG, 100, fOut);
            fOut.flush();
            fOut.close();
            b.recycle();
            b.recycle();

            return 0;
        } catch (Exception e) {
        }

        return -1;
    }

    public Bitmap revResizeBitmapImage(String path, int IMAGE_MAX_SIZE) {
        Uri uri = Uri.fromFile(new File(path));
        InputStream in;
        try {
            in = mContext.getContentResolver().openInputStream(uri);

            // Decode image size
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inJustDecodeBounds = true;
            BitmapFactory.decodeStream(in, null, options);
            in.close();

            int scale = 1;
            while ((options.outWidth * options.outHeight) * (1 / Math.pow(scale, 2)) > IMAGE_MAX_SIZE) {
                scale++;
            }

            Bitmap resultBitmap;
            in = mContext.getContentResolver().openInputStream(uri);

            if (scale > 1) {
                scale--;
                // scale to max possible inSampleSize that still yields an image
                // larger than target
                options = new BitmapFactory.Options();
                options.inSampleSize = scale;
                resultBitmap = BitmapFactory.decodeStream(in, null, options);

                // resize to desired dimensions
                int height = resultBitmap.getHeight();
                int width = resultBitmap.getWidth();

                double y = Math.sqrt(IMAGE_MAX_SIZE / (((double) width) / height));
                double x = (y / height) * width;

                Bitmap scaledBitmap = Bitmap.createScaledBitmap(resultBitmap, (int) x, (int) y, true);
                resultBitmap.recycle();
                resultBitmap = scaledBitmap;

                System.gc();
            } else {
                resultBitmap = BitmapFactory.decodeStream(in);
            }
            in.close();

            return resultBitmap;

        } catch (IOException e) {
            return null;
        }
    }
}
