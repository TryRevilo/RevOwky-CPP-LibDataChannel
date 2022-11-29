package rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_pers_file;

import android.app.ProgressDialog;
import android.content.Context;
import android.os.AsyncTask;

import java.io.BufferedInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.REV_PERS_REVMETADATA_GEN_FUNCTIONS;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityRelationship;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.c_libs_core.rev_java_lib.RevPersJava;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;
import rev.ca.rev_gen_lib_pers.rev_varags_data.RevPersConstantine;
import rev.ca.rev_lib_gen_functions.I_REV_PROCESS_FINISH;
import rev.ca.rev_lib_gen_functions.REV_STRINGS_BASE_FUNCTIONS;

public class RevMultiDownloadFileFromURL extends AsyncTask<String, Integer, Void> {

    private Context mContext;
    private long revPicsAlbumGUID;
    private List<RevEntity> revEntityList;
    private I_REV_PROCESS_FINISH i_rev_process_finish;

    private ProgressDialog pDialog;

    RevPersJava revPersJava = new RevPersJava();
    RevPersLibRead revPersLibRead = new RevPersLibRead();

    List<InputStream> inputStreamList = new ArrayList<>();

    int lenghtOfFile = 0;
    int remLenghtOfFile = 0;

    public RevMultiDownloadFileFromURL(Context mContext, long revPicsAlbumGUID, List<RevEntity> revEntityList, I_REV_PROCESS_FINISH i_rev_process_finish) {
        this.mContext = mContext;
        this.revPicsAlbumGUID = revPicsAlbumGUID;
        this.revEntityList = revEntityList;
        this.i_rev_process_finish = i_rev_process_finish;
    }

    @Override
    protected void onPreExecute() {
        pDialog = new ProgressDialog(mContext);
        pDialog.setMessage("REV in progress . . . .");
        pDialog.setIndeterminate(false);
        pDialog.setMax(100);
        pDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        pDialog.setCancelable(true);
        // pDialog.show();
    }

    @Override
    protected Void doInBackground(String... f_url) {
        for (RevEntity revFileEntity : revEntityList) {
            if (!revFileEntity.get_revEntitySubType().equals("rev_file"))
                continue;

            final Long aLong = revFileEntity.get_revEntityGUID();

            List<RevEntityMetadata> revEntityMetadataList = revPersLibRead.revPersGetALLRevEntityMetadataByRevEntityGUID(aLong);
            String revFilePath = REV_PERS_REVMETADATA_GEN_FUNCTIONS.REV_GET_METADATA_VALUE(revEntityMetadataList, "rev_remote_file_name");

            if (REV_STRINGS_BASE_FUNCTIONS.REV_IS_NULL_OR_EMPTY_STRING(revFilePath)) continue;

            URL url;
            try {
                url = new URL(REV_SESSION_SETTINGS.getRevRemoteImageFilesRoot() + "/" + revFilePath);

                URLConnection conection = url.openConnection();
                conection.connect();

                // this will be useful so that you can show a tipical 0-100%
                // progress bar
                int itemLength = conection.getContentLength();

                if (itemLength > 1) lenghtOfFile += itemLength;

                // download the file
                InputStream input = new BufferedInputStream(url.openStream(), 8192);
                inputStreamList.add(input);
            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return null;
    }

    @Override
    protected void onPostExecute(Void aVoid) {
        if (pDialog.isShowing()) {
            pDialog.dismiss();
        }

        new AsyncTask<Void, Void, Void>() {
            @Override
            protected Void doInBackground(Void... voids) {
                for (int i = 0; i < inputStreamList.size(); i++) {
                    InputStream inputStream = inputStreamList.get(i);

                    Long aLong = revEntityList.get(i).get_revEntityGUID();
                    List<RevEntityMetadata> revEntityMetadataList = revPersLibRead.revPersGetALLRevEntityMetadataByRevEntityGUID(aLong);
                    String revFileName = REV_PERS_REVMETADATA_GEN_FUNCTIONS.REV_GET_METADATA_VALUE(revEntityMetadataList, "rev_file_name_value");

                    int count;

                    // Output stream
                    OutputStream output = null;
                    try {
                        output = new FileOutputStream(RevPersConstantine.revBaseUserImagesLargeDirPath + "/" + revFileName);

                        byte data[] = new byte[1024];

                        while ((count = inputStream.read(data)) != -1) {
                            // publishing the progress....
                            // After this onProgressUpdate will be called

                            remLenghtOfFile = remLenghtOfFile + count;
                            float revProgressPerc = (((float) remLenghtOfFile) / lenghtOfFile) * 100;
                            // writing data to file
                            output.write(data, 0, count);
                        }

                        // flushing output
                        output.flush();

                        // closing streams
                        output.close();
                        inputStream.close();

                        RevEntityRelationship revInfoPicAlbumRel = new RevEntityRelationship("rev_picture_of", aLong, revPicsAlbumGUID);
                        revInfoPicAlbumRel.set_revResolveStatus(0);
                        revInfoPicAlbumRel.set_remoteRevEntitySubjectGUID(revPersLibRead.getRemoteRevEntityGUID(aLong));
                        revInfoPicAlbumRel.set_remoteRevEntityTargetGUID(revPicsAlbumGUID);
                        revPersJava.saveRevEntity_NO_REMOTE_SYNC(revInfoPicAlbumRel);
                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

                i_rev_process_finish.REV_PROCESS_FINISH(null);

                return null;
            }
        }.execute();
    }

    @Override
    protected void onProgressUpdate(Integer... values) {
        super.onProgressUpdate(values);
        pDialog.setProgress(values[0]);
    }
}
