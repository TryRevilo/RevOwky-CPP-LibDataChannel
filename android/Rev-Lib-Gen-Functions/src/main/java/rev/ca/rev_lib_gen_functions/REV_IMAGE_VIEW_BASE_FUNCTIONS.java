package rev.ca.rev_lib_gen_functions;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.AsyncTask;

import androidx.annotation.ColorInt;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class REV_IMAGE_VIEW_BASE_FUNCTIONS extends AsyncTask<String, Void, Integer> {

    public interface IREV_IMAGE_VIEW_BASE_FUNCTIONS {
        void processFinishGetBitmapDorminantColor(int i);
    }

    private IREV_IMAGE_VIEW_BASE_FUNCTIONS delegate;

    public REV_IMAGE_VIEW_BASE_FUNCTIONS(IREV_IMAGE_VIEW_BASE_FUNCTIONS delegate) {
        this.delegate = delegate;
    }

    public static int REV_GET_DOMINANT_COLOR(String bitmapPath) {
        if (!RevFileFunctions.REV_FILE_IS_IMAGE(bitmapPath)) return -1;

        Bitmap newBitmap = BitmapFactory.decodeFile(bitmapPath);

        if (newBitmap == null) return -1;

        final int color = newBitmap.getPixel(0, 0);
        newBitmap.recycle();

        return getContrastColor(color);
    }

    @ColorInt
    public static int getContrastColor(@ColorInt int color) {
        // Counting the perceptive luminance - human eye favors green color...
        double a = 1 - (0.299 * Color.red(color) + 0.587 * Color.green(color) + 0.114 * Color.blue(color)) / 255;
        return a < 0.5 ? Color.BLACK : Color.WHITE;
    }

    public boolean isColorDark(int color) {
        double darkness = 1 - (0.299 * Color.red(color) + 0.587 * Color.green(color) + 0.114 * Color.blue(color)) / 255;

        if (darkness < 0.5) {
            return false; // It's a light color
        } else {
            return true; // It's a dark color
        }
    }

    public static int REV_MANIPULATE_COLOR_TONE(int color, float factor) {
        int a = Color.alpha(color);
        int r = Math.round(Color.red(color) * factor);
        int g = Math.round(Color.green(color) * factor);
        int b = Math.round(Color.blue(color) * factor);
        return Color.argb(a,
                Math.min(r, 255),
                Math.min(g, 255),
                Math.min(b, 255));
    }

    @Override
    protected Integer doInBackground(String... strings) {
        String bitmapPath = strings[0];

        try {
            URL url = new URL(bitmapPath);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoInput(true);
            connection.connect();
            InputStream input = connection.getInputStream();

            Bitmap myBitmap = BitmapFactory.decodeStream(input);

            if (myBitmap == null) return null;

            Bitmap newBitmap = Bitmap.createScaledBitmap(myBitmap, 1, 1, true);
            final int color = myBitmap.getPixel(0, 0);
            newBitmap.recycle();

            if (!isColorDark(color)) return null;

            return color;
        } catch (IOException e) {
            // Log exception
            return null;
        }
    }

    @Override
    protected void onPostExecute(Integer integer) {
        if (integer != null) {
            delegate.processFinishGetBitmapDorminantColor(integer);
        } else
            delegate.processFinishGetBitmapDorminantColor(Color.parseColor("#82ada9"));
    }
}
