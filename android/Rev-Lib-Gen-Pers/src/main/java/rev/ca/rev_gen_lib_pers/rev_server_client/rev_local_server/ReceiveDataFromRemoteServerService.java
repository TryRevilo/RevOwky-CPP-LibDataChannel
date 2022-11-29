package rev.ca.rev_gen_lib_pers.rev_server_client.rev_local_server;

import android.os.AsyncTask;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;

import rev.ca.rev_lib_gen_functions.RevLangStrings;

public class ReceiveDataFromRemoteServerService extends AsyncTask<Object, Object, Object> {

    private Socket hostThreadSocket;
    private IReceiveDataFromRemoteServer delegate;

    public static final int BUFFER_SIZE = 2048;
    private BufferedReader in = null;

    public ReceiveDataFromRemoteServerService(Socket hostThreadSocket, IReceiveDataFromRemoteServer delegate) {
        this.hostThreadSocket = hostThreadSocket;
        this.delegate = delegate;
    }

    @Override
    protected Object doInBackground(Object... objects) {
        return this.receiveDataFromServer();
    }

    @Override
    protected void onPostExecute(Object o) {
        delegate.processFinishRevReceiveDataAsync(o);
    }

    public JSONObject receiveDataFromServer() {
        JSONObject postJSONObject = new JSONObject();

        try {
            in = new BufferedReader(new InputStreamReader(hostThreadSocket.getInputStream()));

            String retServerData = "";
            int charsRead;
            char[] buffer = new char[BUFFER_SIZE];

            while ((charsRead = in.read(buffer)) != -1) {
                retServerData += new String(buffer).substring(0, charsRead);
            }

            postJSONObject = new JSONObject(retServerData);

        } catch (IOException e) {
            Log.e("MyApp", "Error receiving response:  " + e.getMessage());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return postJSONObject;
    }
}
