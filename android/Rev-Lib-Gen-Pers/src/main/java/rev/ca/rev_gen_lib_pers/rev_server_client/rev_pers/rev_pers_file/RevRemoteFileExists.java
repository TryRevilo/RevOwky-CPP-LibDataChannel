package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_pers_file;

import android.os.AsyncTask;

import java.net.HttpURLConnection;
import java.net.URL;

public class RevRemoteFileExists extends AsyncTask<String, Void, Boolean> {

    public interface IRevRemoteFileExists {
        void revFileExists(boolean revFileExists);
    }

    private IRevRemoteFileExists iRevRemoteFileExists;

    public RevRemoteFileExists(IRevRemoteFileExists iRevRemoteFileExists) {
        this.iRevRemoteFileExists = iRevRemoteFileExists;
    }

    @Override
    protected Boolean doInBackground(String... strings) {
        String revURL = String.valueOf(strings[0]);

        try {
            HttpURLConnection.setFollowRedirects(false);
            HttpURLConnection con =
                    (HttpURLConnection) new URL(revURL).openConnection();
            con.setRequestMethod("HEAD");
            return (con.getResponseCode() == HttpURLConnection.HTTP_OK);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    protected void onPostExecute(Boolean aBoolean) {
        iRevRemoteFileExists.revFileExists(aBoolean);
    }
}
