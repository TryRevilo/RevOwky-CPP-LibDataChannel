package rev.ca.rev_gen_lib_pers.c_libs_core.rev_java_lib;

import android.app.ProgressDialog;
import android.content.Context;
import android.graphics.Typeface;
import android.os.AsyncTask;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.style.AbsoluteSizeSpan;
import android.text.style.ForegroundColorSpan;
import android.text.style.StyleSpan;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import rev.ca.rev_gen_lib_pers.R;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityRelationship;
import rev.ca.rev_gen_lib_pers.rev_pers_file.RevResizeFileSizes;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_entity.RevSaveRevEntitiesToServerResolver;
import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;
import rev.ca.rev_gen_lib_pers.rev_varags_data.RevVarArgsData;
import rev.ca.rev_lib_gen_functions.REV_STRINGS_BASE_FUNCTIONS;
import rev.ca.rev_lib_gen_functions.RevFileFunctions;
import rev.ca.rev_lib_gen_functions.RevLibGenConstantine;
import rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderContract;

public class RevPersFilesAsyncTask extends AsyncTask<Object, Integer, Object> {

    public interface IRevPersAsyncResponse {
        void revPersProcessFinish(Object output);
    }

    private RevVarArgsData revVarArgsData;
    private Context mContext;
    private ProgressDialog pDialog;

    private RevPersJava revPersJava = new RevPersJava();

    String revEntityRelationshipType;
    Long revFileLibContainerEntityGUID;

    public IRevPersAsyncResponse delegate;

    public RevPersFilesAsyncTask(RevVarArgsData revVarArgsData, IRevPersAsyncResponse delegate) {
        this.revVarArgsData = revVarArgsData;
        this.mContext = revVarArgsData.getmContext();
        this.delegate = delegate;
    }

    @Override
    protected void onPreExecute() {
        String revDec = "FiLE LoADiNG iN pRoGREss . . . .";
        SpannableString revDecSpan = new SpannableString(revDec);

        StyleSpan boldSpan = new StyleSpan(Typeface.BOLD);
        revDecSpan.setSpan(boldSpan, 0, revDec.length() / 2, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        revDecSpan.setSpan(new AbsoluteSizeSpan((int) (RevLibGenConstantine.REV_TEXT_SIZE_LARGE * .35)), 0, 4, Spannable.SPAN_INCLUSIVE_INCLUSIVE);

        if (revDec.length() > 8)
            revDecSpan.setSpan(new AbsoluteSizeSpan(RevLibGenConstantine.REV_TEXT_SIZE_TINY), 5, (revDec.length() - (revDec.length() / 2)), Spannable.SPAN_INCLUSIVE_INCLUSIVE);

        pDialog = new ProgressDialog(mContext);
        pDialog.setMessage(revDecSpan);
        pDialog.setIndeterminate(false);
        pDialog.setMax(100);
        pDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        pDialog.setCancelable(true);
        pDialog.show();
    }

    @Override
    protected Object doInBackground(Object... voids) {
        List<Long> revEntityGUIDs = new ArrayList<>();

        final List<String> selectedItems = (List<String>) voids[0];

        RevEntity revFileLibContainer = new RevEntity();
        revFileLibContainer.set_revEntityType(FeedReaderContract.FeedEntry_REV_OBJECT_ENTITY.TABLE_NAME);
        revFileLibContainer.set_revEntitySubType("rev_pics_album");
        revFileLibContainer.set_revEntityOwnerGUID(REV_SESSION_SETTINGS.getRevLoggedInEntityGuid());
        revFileLibContainer.set_revEntityContainerGUID(revVarArgsData.getRevContainerEntityGUID());

        if (revVarArgsData.getRevContainerEntityGUID() > 0) {
            revFileLibContainer.set_revEntityChildableStatus(301);
        } else {
            revFileLibContainer.set_revEntityChildableStatus(3);
        }

        revFileLibContainerEntityGUID = (Long) revPersJava.saveRevEntity_NO_REMOTE_SYNC(revFileLibContainer);

        revPersJava.saveRevEntity_NO_REMOTE_SYNC(new RevEntityRelationship("rev_pics_album_of", revFileLibContainerEntityGUID, revVarArgsData.getRevContainerEntityGUID()));

        for (int i = 0; i < selectedItems.size(); i++) {
            String imageURL = selectedItems.get(i);

            RevEntity revPersEntity = new RevEntity();

            revPersEntity.set_revEntityType(FeedReaderContract.FeedEntry_REV_OBJECT_ENTITY.TABLE_NAME);
            revPersEntity.set_revEntitySubType("rev_file");
            revPersEntity.set_revEntityOwnerGUID(revVarArgsData.getRevOwnerEntityGUID());
            revPersEntity.set_revEntityChildableStatus(2);

            RevEntityMetadata revLocalFilePathMetadata = new RevEntityMetadata("rev_file_path_value", imageURL);
            revLocalFilePathMetadata.set_resolveStatus(0);

            revPersEntity.set_revEntityMetadataList(Arrays.asList(
                    revLocalFilePathMetadata,
                    new RevEntityMetadata("rev_file_name_value", RevFileFunctions.REV_FILENAME_WITH_EXT(imageURL))
            ));

            long revPersId = (Long) revPersJava.saveRevEntity_NO_REMOTE_SYNC(revPersEntity);

            if (revPersId > 0) {
                revEntityGUIDs.add(revPersId);
                if (RevFileFunctions.REV_FILE_IS_IMAGE(imageURL)) {
                    List<Integer> revFileSizes = Arrays.asList(RevLibGenConstantine.IMAGE_MAX_SIZE_X_SMALL, RevLibGenConstantine.IMAGE_MAX_SIZE_SMALL, RevLibGenConstantine.IMAGE_MAX_SIZE_MEDIUM, RevLibGenConstantine.IMAGE_MAX_SIZE_LARGE);

                    for (int revFileSize : revFileSizes) {
                        new RevResizeFileSizes(imageURL, revFileSize).revResizeImage();
                    }
                }
            }

            int progressCount = i + 1;
            publishProgress((int) ((progressCount * 100) / selectedItems.size()));
        }

        revEntityRelationshipType = (String) voids[1];

        return revEntityGUIDs;
    }

    @Override
    protected void onProgressUpdate(Integer... values) {
        super.onProgressUpdate(values);
        pDialog.setProgress(values[0]);
    }

    @Override
    protected void onPostExecute(Object result) {
        if (pDialog.isShowing()) {
            pDialog.dismiss();
        }

        if (!REV_STRINGS_BASE_FUNCTIONS.REV_IS_NULL_OR_EMPTY_STRING(revEntityRelationshipType)) {
            List<Long> revEntityGUIDs = (List<Long>) result;

            List<Long> savedRevRels = new ArrayList<>();

            for (int i = 0; i < revEntityGUIDs.size(); i++) {
                long revEntityGUID = revEntityGUIDs.get(i);
                long relId = (Long) revPersJava.saveRevEntity_NO_REMOTE_SYNC(new RevEntityRelationship(revEntityRelationshipType, revEntityGUID, revFileLibContainerEntityGUID));

                if (relId < 0) {
                    i--;
                    continue;
                }

                savedRevRels.add(relId);
            }

            if (delegate != null)
                delegate.revPersProcessFinish(savedRevRels);
        }
    }
}
