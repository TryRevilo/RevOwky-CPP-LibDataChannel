package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_pers_file;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.widget.ImageView;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.List;

import rev.ca.rev_lib_gen_functions.RevLibGenConstantine;

public class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {
    List<String> revImageURLs = new ArrayList<>();
    private ImageView revBmImage;

    private IDownloadImageTask revDelegate;

    public interface IDownloadImageTask {
        void processFinishDownloadImageTask(Bitmap bitmap);
    }

    public DownloadImageTask(String revImageURL, ImageView revBmImage, IDownloadImageTask revDelegate) {
        this.revBmImage = revBmImage;
        this.revDelegate = revDelegate;

        revImageURLs.add(revImageURL);
    }

    public DownloadImageTask(List<String> revImageURLs, ImageView revBmImage, IDownloadImageTask revDelegate) {
        this.revImageURLs = revImageURLs;
        this.revBmImage = revBmImage;
        this.revDelegate = revDelegate;
    }

    public DownloadImageTask(String revImageURL, ImageView revBmImage) {
        this.revBmImage = revBmImage;

        revImageURLs.add(revImageURL);
    }

    protected Bitmap doInBackground(String... urls) {
        int revBmSize;

        try {
            revBmSize = Integer.parseInt(urls[0]);
        } catch (IndexOutOfBoundsException e) {
            revBmSize = RevLibGenConstantine.REV_IMAGE_SIZE_LARGE;
        }

        Bitmap revBitmap = null;

        for (String revPath : revImageURLs) {
            revBitmap = revHelper(revPath);

            if (revBitmap != null) break;
        }

        if (revBitmap == null) return null;

        revBitmap = scaleToFitHeight(revBitmap, revBmSize);

        return revBitmap;
    }

    protected void onPostExecute(Bitmap result) {
        revBmImage.setImageBitmap(result);

        if (revDelegate != null)
            revDelegate.processFinishDownloadImageTask(result);
    }

    private Bitmap revHelper(String revPath) {
        Bitmap revBitmap = null;
        InputStream inputStream;

        HttpURLConnection urlConnection;
        try {
            urlConnection = (HttpURLConnection) new java.net.URL(revPath).openConnection();

            int status = urlConnection.getResponseCode();

            if (status != HttpURLConnection.HTTP_OK) {
                return null;
            } else {
                inputStream = urlConnection.getInputStream();

                BitmapFactory.Options options = new BitmapFactory.Options();
                options.inScaled = false;

                revBitmap = BitmapFactory.decodeStream(inputStream, null, options);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return revBitmap;
    }

    public static Bitmap scaleToFitWidth(Bitmap b, int width) {
        float factor = width / (float) b.getWidth();
        return Bitmap.createScaledBitmap(b, width, (int) (b.getHeight() * factor), true);
    }

    public static Bitmap scaleToFitHeight(Bitmap b, int height) {
        float factor = height / (float) b.getHeight();
        return Bitmap.createScaledBitmap(b, (int) (b.getWidth() * factor), height, true);
    }
}
