package rev.ca.rev_gen_lib_pers.rev_server_client.rev_local_server;

import android.app.Activity;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

import rev.ca.rev_lib_gen_functions.RevLibGenConstantine;

public class RevLocalServer {

    RevLocalServer revLocalServer;

    Activity activity;
    ServerSocket serverSocket;
    Socket hostThreadSocket;

    private PrintWriter out = null;
    static int socketServerPORT = RevLibGenConstantine.REV_CONN_SOCKET;

    String message = "";

    public RevLocalServer(Activity activity) {
        this.activity = activity;

        revLocalServer = this;

        new Thread(new SocketServerThread()).start();
    }

    public void onDestroy() {
        if (serverSocket != null) {
            try {
                serverSocket.close();
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
    }

    private class SocketServerThread extends Thread {

        int count = 0;

        @Override
        public void run() {
            try {
                // create ServerSocket using specified port
                serverSocket = new ServerSocket(socketServerPORT);

                while (true) {
                    // block the call until connection is created and return
                    // Socket object
                    Socket socket = serverSocket.accept();
                    count++;
                    message += "\n\t\t#" + count + " from " + socket.getInetAddress() + ":" + socket.getPort() + "\n";

                    new SocketServerReplyThread(socket, count).run();
                }
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
    }

    private class SocketServerReplyThread extends Thread {
        int cnt;

        SocketServerReplyThread(Socket socket, int c) {
            hostThreadSocket = socket;
            cnt = c;
        }

        @Override
        public void run() {
            new ReceiveDataFromRemoteServerService(hostThreadSocket, new IReceiveDataFromRemoteServer() {
                @Override
                public void processFinishRevReceiveDataAsync(Object o) {
                    // Log.v(RevLangStrings.REV_TAG, "SERVER DATA >>> ::: " + o.toString());
                }
            }).execute();

            sendDataWithString(message);
        }
    }

    public void sendDataWithString(String message) {
        try {
            out = new PrintWriter(hostThreadSocket.getOutputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }

        if (message != null) {
            out.write(message);
            out.flush();
        }
    }
}
