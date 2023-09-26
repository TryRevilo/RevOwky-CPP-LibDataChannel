package com.owki.rev_react_modules.rev_persistence;

import android.app.Activity;
import android.content.ContentResolver;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.io.File;

import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibCreate;

public class RevPersLibCreate_React extends ReactContextBaseJavaModule {
    public RevPersLibCreate_React(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    public String revGetFilePathFromContentUri(Uri contentUri) {
        Activity activity = getCurrentActivity();

        if (activity == null) {
            Log.d("MyApp", ">>> activity == null");

            return null;
        }

        ContentResolver contentResolver = activity.getContentResolver();

        String[] projection = {MediaStore.Images.Media.DATA};
        Cursor cursor = contentResolver.query(contentUri, projection, null, null, null);
        if (cursor == null) {
            Log.d("MyApp", ">>> cursor == null");

            return null;
        }
        int columnIndex = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
        cursor.moveToFirst();
        String filePath = cursor.getString(columnIndex);
        cursor.close();
        return filePath;
    }

    public String[] getProjection(Uri uri) {
        String[] projection = null;
        ContentResolver contentResolver = getReactApplicationContext().getContentResolver();
        String mimeType = contentResolver.getType(uri);

        if (mimeType == null) {
            // If the MIME type is null, assume the file is a media file
            projection = new String[]{MediaStore.MediaColumns.DATA};
        } else if (mimeType.startsWith("image")) {
            projection = new String[]{MediaStore.Images.Media.DATA};
        } else if (mimeType.startsWith("video")) {
            projection = new String[]{MediaStore.Video.Media.DATA};
        } else if (mimeType.startsWith("audio")) {
            projection = new String[]{MediaStore.Audio.Media.DATA};
        }

        return projection;
    }


    public String revGetFilePathFromStringURI(String contentUri) {
        Uri uri = Uri.parse(contentUri);

        String filePath = "";
        if (uri.getScheme().equals("content")) {
            ContentResolver contentResolver = getReactApplicationContext().getContentResolver();
            String[] projection = {MediaStore.Images.Media.DATA};
            Cursor cursor = contentResolver.query(uri, projection, null, null, null);
            if (cursor != null) {
                if (cursor.moveToFirst()) {
                    int columnIndex = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
                    filePath = cursor.getString(columnIndex);
                    Log.d("MyApp", ">>> filePath " + filePath);
                }
                cursor.close();
            }
        } else if (uri.getScheme().equals("file")) {
            filePath = uri.getPath();
        }
        return filePath;
    }


    RevPersLibCreate revPersLibCreate = new RevPersLibCreate();

    @NonNull
    @Override
    public String getName() {
        return "RevPersLibCreate_React";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public void revPersInitReact(String dbPath) {
        revPersLibCreate.initRevDb(dbPath);
        revPersLibCreate.revTablesInit();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersInitJSON(String revEntityJSON) {
        int revRet = (int) revPersLibCreate.revPersInitJSON(revEntityJSON);

        return revRet;
    }

    /**
     * START METADATA
     **/

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersSaveEntityMetadataJSONStr(String revEntityMetadataJSONStr) {
        return (int) revPersLibCreate.revPersSaveEntityMetadataJSONStr(revEntityMetadataJSONStr);
    }

    /**
     * END METADATA
     **/

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersRelationshipJSON(String revJSONEntityRelationship) {
        int revret = (int) revPersLibCreate.revPersRelationshipJSON(revJSONEntityRelationship);

        return revret;
    }

    /**
     * START ANNOTATIONS
     **/
    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersRevEntityAnnotationWithValues(String _revAnnotationName, String _revAnnotationValue, Integer _revEntityGUID, Integer _ownerEntityGUID) {
        int revret = (int) revPersLibCreate.revPersRevEntityAnnotationWithValues(_revAnnotationName, _revAnnotationValue, _revEntityGUID, _ownerEntityGUID);

        return revret;
    }

    /**
     * END ANNOTATIONS
     **/

    private boolean revIsStringNullOrEmpty(String revString) {
        return (revString == null || revString.trim().isEmpty());
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public void revCURLFileUpload(String revURL, String revFiles, String revData) {
        revPersLibCreate.revCURLFileUpload(revURL, revFiles, revData);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revCopyFile(String revSourcePath, String revDestPath) {
        if (revIsStringNullOrEmpty(revSourcePath) || revIsStringNullOrEmpty(revDestPath)) {
            return -1;
        }

        return revPersLibCreate.revCopyFile(revSourcePath, revDestPath);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revCopyFileAsync(String revSourcePath, String revDestPath) {
        Uri revURI = Uri.parse(revSourcePath);
        File file = new File(revURI.getPath());

        String revURIFilePath = file.getAbsolutePath().replace("/document/primary:", "/storage/emulated/0/");

        Log.d("MyApp", ">>> revURIFilePath " + revURIFilePath);
        return revPersLibCreate.revCopyFileAsync(revURIFilePath, revDestPath);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revCopyFileCURL(String revSourcePath, String revDestPath) {
        int revRetVal = revPersLibCreate.revCopyFileCURL(revSourcePath, revDestPath);

        return revRetVal;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revCopyFile_MemoryMapped(String revSourcePath, String revDestPath) {
        Uri revURI = Uri.parse(revSourcePath);
        File file = new File(revURI.getPath());

        String revURIFilePath = file.getAbsolutePath().replace("/document/primary:", "/storage/emulated/0/");

        int revRetVal = revPersLibCreate.revCopyFile_MemoryMapped(revURIFilePath, revDestPath);

        return revRetVal;
    }

    @ReactMethod
    public void revReadResizedFileBytes(String revPath, Promise promise) {
        byte[] fileData = revPersLibCreate.revReadResizedFileBytes(revPath);

        // Construct response object
        WritableMap resultMap = Arguments.createMap();
        resultMap.putString("status", "success");
        resultMap.putArray("data", byteArrayToWritableArray(fileData));

        // Resolve the promise with the response object
        promise.resolve(resultMap);
    }

    private WritableArray byteArrayToWritableArray(byte[] data) {
        WritableArray array = Arguments.createArray();
        for (byte b : data) {
            array.pushInt((int) b);
        }
        return array;
    }
}
