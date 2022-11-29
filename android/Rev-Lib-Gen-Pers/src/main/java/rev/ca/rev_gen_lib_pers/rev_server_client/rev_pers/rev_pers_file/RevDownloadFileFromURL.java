package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_pers_file;

import android.app.ProgressDialog;
import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;

import java.io.BufferedInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;

import rev.ca.rev_gen_lib_pers.rev_varags_data.RevPersConstantine;

public class RevDownloadFileFromURL extends AsyncTask<String, Integer, String> {

    private Context mContext;
    private ProgressDialog pDialog;

    public interface IRevDownloadFileFromURL {
        void revFileDownloadComplete(boolean output);
    }

    private IRevDownloadFileFromURL revDelegate_IRevDownloadFileFromURL;

    public RevDownloadFileFromURL(Context mContext, IRevDownloadFileFromURL revDelegate_IRevDownloadFileFromURL) {
        this.mContext = mContext;
        this.revDelegate_IRevDownloadFileFromURL = revDelegate_IRevDownloadFileFromURL;
    }

    @Override
    protected void onPreExecute() {
        pDialog = new ProgressDialog(mContext);
        pDialog.setMessage("Download in progress . . . .");
        pDialog.setIndeterminate(false);
        pDialog.setMax(100);
        pDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        pDialog.setCancelable(true);
        pDialog.show();
    }

    @Override
    protected String doInBackground(String... f_url) {
        int count;

        String fileName = null;

        try {
            URL url = new URL(f_url[0]);
            fileName = f_url[1];

            URLConnection conection = url.openConnection();
            conection.connect();

            // this will be useful so that you can show a tipical 0-100%
            // progress bar
            int lenghtOfFile = conection.getContentLength();

            // download the file
            InputStream input = new BufferedInputStream(url.openStream(), 8192);

            // Output stream
            OutputStream output = new FileOutputStream(RevPersConstantine.revBaseUserImagesLargeDirPath + "/" + fileName);

            byte data[] = new byte[1024];

            long total = 0;

            while ((count = input.read(data)) != -1) {
                total += count;

                // publishing the progress....
                // After this onProgressUpdate will be called
                publishProgress((int) ((total * 100) / lenghtOfFile));

                // writing data to file
                output.write(data, 0, count);
            }

            // flushing output
            output.flush();

            // closing streams
            output.close();
            input.close();

            return fileName;

        } catch (Exception e) {
            Log.e("Rev DLoad Error >>> : ", e.getMessage());
        }

        return fileName;
    }

    @Override
    protected void onPostExecute(String file_url) {
        if (pDialog.isShowing()) {
            pDialog.dismiss();
        }

        revDelegate_IRevDownloadFileFromURL.revFileDownloadComplete(true);
    }

    @Override
    protected void onProgressUpdate(Integer... values) {
        super.onProgressUpdate(values);
        pDialog.setProgress(values[0]);
    }
}
