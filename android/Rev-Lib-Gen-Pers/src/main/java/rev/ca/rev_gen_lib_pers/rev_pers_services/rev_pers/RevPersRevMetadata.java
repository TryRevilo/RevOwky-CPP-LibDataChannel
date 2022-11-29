package rev.ca.rev_gen_lib_pers.rev_pers_services.rev_pers;


import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import java.util.ArrayList;
import java.util.List;

import rev.ca.rev_lib_gen_functions.REV_TIME;
import rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderContract.FeedEntry_REV_METADATA;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;

public class RevPersRevMetadata {

    private Context mContext;
    private SQLiteDatabase db;

    public RevPersRevMetadata(Context context) {
        mContext = context;
        db = RevDbSet.getDb();
    }

    private void checkDbOpen() {
        if (!db.isOpen())
            db = RevDbSet.getDb();
    }

    public long saveRevMetadata(RevEntityMetadata revEntityMetadata) {
        this.checkDbOpen();

        // Create a new map of values, where column names are the keys
        ContentValues values = new ContentValues();
        values.put(FeedEntry_REV_METADATA.COLUMN_METADATA_OWNER_GUID, revEntityMetadata.getRevMetadataOwnerGUID());
        values.put(FeedEntry_REV_METADATA.COLUMN_METADATA_NAME, revEntityMetadata.get_revMetadataName());
        values.put(FeedEntry_REV_METADATA.COLUMN_METADATA_VALUE_ID, new RevPersRevMetaStrings(mContext).saveRevMetastrings(revEntityMetadata.get_metadataValue()));
        values.put(FeedEntry_REV_METADATA.REV_CREATED_DATE, REV_TIME.GET_REV_CURRENT_TIME());

        // Insert the new row, returning the primary key value of the new row
        return db.insert(FeedEntry_REV_METADATA.TABLE_NAME, null, values);
    }

    public List<RevEntityMetadata> revRead(long revEntityGUID, String revMetadataName) {
        this.checkDbOpen();

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        String[] projection = {
                FeedEntry_REV_METADATA.COLUMN_METADATA_OWNER_GUID,
                FeedEntry_REV_METADATA.COLUMN_METADATA_VALUE_ID,
                FeedEntry_REV_METADATA.COLUMN_METADATA_ID,
                FeedEntry_REV_METADATA.COLUMN_METADATA_NAME,
                FeedEntry_REV_METADATA.REV_CREATED_DATE,
                FeedEntry_REV_METADATA.REV_UPDATED_DATE
        };

        // Cursor cursor = db.query(FeedEntry_REV_METADATA.TABLE_NAME, null, null, null, null, null, null);

        // Filter results WHERE "title" = 'My Title'
        String selection = FeedEntry_REV_METADATA.COLUMN_METADATA_NAME + " = ?" + " AND " + FeedEntry_REV_METADATA.COLUMN_METADATA_OWNER_GUID + " = ?";
        String[] selectionArgs = {revMetadataName, String.valueOf(revEntityGUID)};

        // How you want the results sorted in the resulting Cursor
        String sortOrder =
                FeedEntry_REV_METADATA.REV_CREATED_DATE;

        Cursor cursor = db.query(
                FeedEntry_REV_METADATA.TABLE_NAME,                     // The table to query
                projection,                                                  // The columns to return
                selection,                                                   // The columns for the WHERE clause
                selectionArgs,                                          // The values for the WHERE clause
                null,                                     // don't group the rows
                null,                                        // don't filter by row groups
                sortOrder                                                 // The sort order
        );

        List<RevEntityMetadata> itemIds = new ArrayList<>();
        /**
        while (cursor.moveToNext()) {
            long valueId = cursor.getLong(cursor.getColumnIndexOrThrow(FeedEntry_REV_METADATA.COLUMN_METADATA_VALUE_ID));
            String timeCreated = cursor.getString(cursor.getColumnIndexOrThrow(FeedEntry_REV_METADATA.REV_CREATED_DATE));

            RevEntityMetadata revEntityMetadata = new RevEntityMetadata();
            revEntityMetadata.setRevMetadataValueId(valueId);
            revEntityMetadata.set_metadataValue(new RevPersRevMetaStrings(mContext).revReadMetastringValue(valueId));
            revEntityMetadata.set_timeCreated(timeCreated);

            itemIds.add(revEntityMetadata);
        }
        **/
        cursor.close();

        // Collections.sort(itemIds, Collections.reverseOrder());

        return itemIds;
    }
}
