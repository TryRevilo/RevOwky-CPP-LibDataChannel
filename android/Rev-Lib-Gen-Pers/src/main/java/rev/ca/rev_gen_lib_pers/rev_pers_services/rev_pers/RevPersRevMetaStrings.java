package rev.ca.rev_gen_lib_pers.rev_pers_services.rev_pers;


import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import rev.ca.rev_lib_gen_functions.REV_TIME;
import rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderContract;
import rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderContract.FeedEntry_REV_METASTRINGS;

public class RevPersRevMetaStrings {

    private Context mContext;
    private SQLiteDatabase db;

    public RevPersRevMetaStrings(Context context) {
        mContext = context;
        db = RevDbSet.getDb();
    }

    private void checkDbOpen() {
        if (!db.isOpen())
            db = RevDbSet.getDb();
    }

    public long saveRevMetastrings(String revMetadataValue) {
        this.checkDbOpen();

        // Create a new map of values, where column names are the keys
        ContentValues values = new ContentValues();
        values.put(FeedEntry_REV_METASTRINGS.COLUMN_VALUE, revMetadataValue);
        values.put(FeedEntry_REV_METASTRINGS.REV_CREATED_DATE, REV_TIME.GET_REV_CURRENT_TIME());

        // Insert the new row, returning the primary key value of the new row
        long id = db.insert(FeedEntry_REV_METASTRINGS.TABLE_NAME, null, values);

        return id;
    }

    public String revReadMetastringValue(long id) {
        this.checkDbOpen();

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        String[] projection = {
                FeedEntry_REV_METASTRINGS.COLUMN_VALUE
        };

        // Filter results WHERE "title" = 'My Title'
        String selection = FeedEntry_REV_METASTRINGS.REV_ID + " = ?";
        String[] selectionArgs = {String.valueOf(id)};

        Cursor cursor = db.query(
                FeedEntry_REV_METASTRINGS.TABLE_NAME,                     // The table to query
                projection,                                                  // The columns to return
                selection,                                                   // The columns for the WHERE clause
                selectionArgs,                                          // The values for the WHERE clause
                null,                                     // don't group the rows
                null,                                        // don't filter by row groups
                null                                                 // The sort order
        );

        cursor.moveToFirst();

        if (cursor != null) {
            cursor.moveToFirst();
            return cursor.getString(0);
        } else {
            Log.d("Error", "No record exists");
        }

        cursor.close();

        return null;
    }

    public long revReadMetastringId(String revMetastring) {
        this.checkDbOpen();

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        String[] projection = {
                FeedEntry_REV_METASTRINGS.REV_ID
        };

        // Filter results WHERE "title" = 'My Title'
        String selection = FeedEntry_REV_METASTRINGS.COLUMN_VALUE + " = ?";
        String[] selectionArgs = {revMetastring};

        Cursor cursor = db.query(
                FeedEntry_REV_METASTRINGS.TABLE_NAME,                     // The table to query
                projection,                                                  // The columns to return
                selection,                                                   // The columns for the WHERE clause
                selectionArgs,                                          // The values for the WHERE clause
                null,                                     // don't group the rows
                null,                                        // don't filter by row groups
                null                                                 // The sort order
        );

        /**
        if (cursor != null && cursor.moveToFirst()) {
            cursor.moveToFirst();
            return cursor.getLong(cursor.getColumnIndex(FeedEntry_REV_METASTRINGS.REV_ID));
        } else {
            Log.d("Error", "No record exists");
        }
        **/

        cursor.close();

        return Long.parseLong(null);
    }

    public long revGetMetastringOwnerEntityGUID(String revMetastringValue) {
        this.checkDbOpen();

        long revMetastringId = revReadMetastringId(revMetastringValue);

        if (revMetastringId < 1)
            Log.v("MyApp", "NO DB VALUE");

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        String[] projection = {
                FeedReaderContract.FeedEntry_REV_METADATA.COLUMN_METADATA_OWNER_GUID
        };

        // Filter results WHERE "title" = 'My Title'
        String selection = FeedReaderContract.FeedEntry_REV_METADATA.COLUMN_METADATA_VALUE_ID + " = ?";
        String[] selectionArgs = {String.valueOf(revMetastringId)};

        Cursor cursor = db.query(
                FeedReaderContract.FeedEntry_REV_METADATA.TABLE_NAME,                     // The table to query
                projection,                                                  // The columns to return
                selection,                                                   // The columns for the WHERE clause
                selectionArgs,                                          // The values for the WHERE clause
                null,                                     // don't group the rows
                null,                                        // don't filter by row groups
                null                                                 // The sort order
        );

        /**
        if (cursor != null && cursor.moveToFirst()) {
            cursor.moveToFirst();
            return cursor.getLong(cursor.getColumnIndex(FeedReaderContract.FeedEntry_REV_METADATA.COLUMN_METADATA_OWNER_GUID));
        } else {
            Log.d("Error", "No record exists");
        }
        **/

        cursor.close();

        return Long.parseLong(null);
    }
}
