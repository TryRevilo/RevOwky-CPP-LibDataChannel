package rev.ca.rev_gen_lib_pers.rev_pers_file;

import android.os.AsyncTask;

import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.REV_PERS_REVMETADATA_GEN_FUNCTIONS;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibCreate;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibUpdate;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_pers_file.RevFileUploaderAsyncHttpClient;
import rev.ca.rev_lib_gen_functions.I_REV_PROCESS_FINISH;
import rev.ca.rev_lib_gen_functions.REV_TIME;
import rev.ca.rev_lib_gen_functions.RevFileFunctions;

public class RevSaveRemoteFileNamesMetadata extends AsyncTask<Void, Void, Void> {

    private List<Long> revEntityList;
    private I_REV_PROCESS_FINISH i_rev_process_finish;

    private RevPersLibRead revPersLibRead = new RevPersLibRead();
    private RevPersLibCreate revPersLibCreate = new RevPersLibCreate();
    private RevPersLibUpdate revPersLibUpdate = new RevPersLibUpdate();

    public RevSaveRemoteFileNamesMetadata(List<Long> revEntityList, I_REV_PROCESS_FINISH i_rev_process_finish) {
        this.revEntityList = revEntityList;
        this.i_rev_process_finish = i_rev_process_finish;
    }

    @Override
    protected Void doInBackground(Void... voids) {
        for (int i = 0; i < revEntityList.size(); i++) {
            Long aLong = revEntityList.get(i);

            RevEntity revEntity = revPersLibRead.revPersGetRevEntityByGUID(aLong);

            if (revEntity == null || revEntity.get_remoteRevEntityGUID() < 1)
                continue;

            List<RevEntityMetadata> revEntityMetadataList = revPersLibRead.revPersGetALLRevEntityMetadataByRevEntityGUID(aLong);
            String revFilePath = REV_PERS_REVMETADATA_GEN_FUNCTIONS.REV_GET_METADATA_VALUE(revEntityMetadataList, "rev_file_path_value");

            String revFileExt = RevFileFunctions.REV_FILE_EXT(revFilePath);

            String revResolvedRemoteFileName_S = RevFileFunctions.REV_FILENAME_WITHOUT_EXT(revFilePath);
            revResolvedRemoteFileName_S = revResolvedRemoteFileName_S + "-d" + REV_TIME.GET_REV_CURRENT_TIME_DASH_SEP() + "-g" + revEntity.get_remoteRevEntityGUID() + "." + revFileExt;

            RevEntityMetadata revEntityMetadata = new RevEntityMetadata();
            revEntityMetadata.set_revMetadataName("rev_remote_file_name");
            revEntityMetadata.setRevMetadataOwnerGUID(aLong);
            revEntityMetadata.set_metadataValue(revResolvedRemoteFileName_S);
            revEntityMetadata.set_resolveStatus(-1);

            int revResolveReturnStatus = revPersLibUpdate.setRevEntityResolveStatusByRevEntityGUID(-7, aLong);

            if (revResolveReturnStatus == 1) {
                revPersLibCreate.revSaveRevEntityMetadata(revEntityMetadata);
            }
        }
        return null;
    }

    @Override
    protected void onPostExecute(Void aVoid) {
        List<Long> longList = new RevPersLibRead().revPersGetALLRevEntityGUIDs_By_ResStatus(-7);

        if (longList.isEmpty()) {
            i_rev_process_finish.REV_PROCESS_FINISH(null);
            return;
        }

        new RevFileUploaderAsyncHttpClient(longList, new I_REV_PROCESS_FINISH() {
            @Override
            public void REV_PROCESS_FINISH(Object o) {
                i_rev_process_finish.REV_PROCESS_FINISH(null);
            }
        });
    }
}
