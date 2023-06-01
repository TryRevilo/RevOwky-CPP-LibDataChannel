package rev.ca.rev_gen_lib_pers.c_libs_core;

import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevAnnotation;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityRelationship;

public class RevPersLibCreate {

    static {
        System.loadLibrary("rev-pers-lib-db-create");
    }

    public native void initRevDb(String dirPath);

    public native void revTablesInit();

    public native long revPersInit(RevEntity revEntity);

    public native long revPersInitJSON(String revJSONEntity);

    public native long revPersRelationship(RevEntityRelationship revEntityRelationship);

    public native long revPersRelationshipJSON(String revJSONEntityRelationship);

    public native long revPersRevEntityAnnotation(RevAnnotation revAnnotation);

    public native long revPersRevEntityAnnotationWithValues(String _revAnnotationName, String _revAnnotationValue, long _revEntityGUID, long _ownerEntityGUID);

    public native List<RevEntityMetadata> revSaveRevEntityMetadataList(List<RevEntityMetadata> revEntityMetadataList);

    public native long revSaveRevEntityMetadata(RevEntityMetadata revEntityMetadata);

    public native long revPersSaveEntityMetadataJSONStr(String revEntityMetadataJSONStr);

    public native void revCURLFileUpload(String revURL, String revFiles, String revData);

    public native int revCopyFile(String revSourcePath, String revDestPath);

    public native int revCopyFileAsync(String revSourcePath, String revDestPath);

    public native int revCopyFile_MemoryMapped(String revSourcePath, String revDestPath);

    public native int revCopyFileCURL(String revSourcePath, String revDestPath);

    public native byte[] revReadResizedFileBytes(String revPath);

}
