package rev.ca.rev_gen_lib_pers.rev_pers_services.rev_pers;


import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

import rev.ca.rev_lib_gen_functions.REV_TIME;
import rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderContract.FeedEntry_REV_ENTITY;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;
import rev.ca.rev_gen_lib_pers.RevDBModels.rev_entity_subtypes.RevObjectEntity;

public class RevPersRevEntity {

    private Context mContext;
    private SQLiteDatabase db;

    public RevPersRevEntity(Context context) {
        mContext = context;
        db = RevDbSet.getDb();
    }

    private void checkDbOpen() {
        if (!db.isOpen())
            db = RevDbSet.getDb();
    }

    public long saveRev(RevEntity revEntity) {
        this.checkDbOpen();

        long revEntityGUID;
        // Create a new map of values, where column names are the keys
        ContentValues values = new ContentValues();
        values.put(FeedEntry_REV_ENTITY.REV_OWNER_GUID, revEntity.get_revEntityOwnerGUID());
        values.put(FeedEntry_REV_ENTITY.REV_CONTAINER_GUID, revEntity.get_revEntityContainerGUID());
        values.put(FeedEntry_REV_ENTITY.REV_TYPE, revEntity.get_revEntityType());
        values.put(FeedEntry_REV_ENTITY.REV_SUBTYPE, revEntity.get_revEntitySubType());
        values.put(FeedEntry_REV_ENTITY.REV_CREATED_DATE, REV_TIME.GET_REV_CURRENT_TIME());

        revEntityGUID = db.insert(FeedEntry_REV_ENTITY.TABLE_NAME, null, values);
        revEntity.set_revEntityGUID(revEntityGUID);

        if (revEntity.get_revEntityMetadataList() != null) {
            RevPersRevMetadata revPersRevMetadata = new RevPersRevMetadata(mContext);
            for (RevEntityMetadata revEntityMetadata : revEntity.get_revEntityMetadataList()) {
                revEntityMetadata.setRevMetadataOwnerGUID(revEntityGUID);
                revPersRevMetadata.saveRevMetadata(revEntityMetadata);
            }
        }

        // Insert the new row, returning the primary key value of the new row
        Toast.makeText(mContext, "Item Successfully Saved! ", Toast.LENGTH_LONG).show();
        return revEntityGUID;
    }

    public int getHighestID() {
        final String MY_QUERY = "SELECT MAX(" + FeedEntry_REV_ENTITY.REV_ENTITY_GUID + ") FROM " + FeedEntry_REV_ENTITY.TABLE_NAME;
        Cursor cur = db.rawQuery(MY_QUERY, null);
        cur.moveToFirst();
        int ID = cur.getInt(0);
        cur.close();
        return ID;
    }

    public boolean emptyTable() {
        boolean empty = true;
        Cursor cur = db.rawQuery("SELECT COUNT(*) FROM " + FeedEntry_REV_ENTITY.TABLE_NAME, null);
        if (cur != null && cur.moveToFirst()) {
            empty = (cur.getInt(0) == 0);
        }
        cur.close();

        return empty;
    }

    public String revReadEntityType(long GUID) {
        this.checkDbOpen();

        String[] projection = {
                FeedEntry_REV_ENTITY.REV_TYPE
        };

        String selection = FeedEntry_REV_ENTITY.REV_ENTITY_GUID + " = ?";
        String[] selectionArgs = {String.valueOf(GUID)};

        Cursor cursor = db.query(
                FeedEntry_REV_ENTITY.TABLE_NAME,                     // The table to query
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
            return cursor.getString(cursor.getColumnIndex(FeedEntry_REV_ENTITY.REV_TYPE));
        } else {
            Log.d("Error", "No record exists");
        }
        **/

        cursor.close();

        return null;
    }

    public String revReadEntitySubType(long GUID) {
        this.checkDbOpen();

        String[] projection = {
                FeedEntry_REV_ENTITY.REV_SUBTYPE
        };

        String selection = FeedEntry_REV_ENTITY.REV_ENTITY_GUID + " = ?";
        String[] selectionArgs = {String.valueOf(GUID)};

        Cursor cursor = db.query(
                FeedEntry_REV_ENTITY.TABLE_NAME,                     // The table to query
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
            return cursor.getString(cursor.getColumnIndex(FeedEntry_REV_ENTITY.REV_SUBTYPE));
        } else {
            Log.d("Error", "No record exists");
        }
        **/

        cursor.close();

        return null;
    }

    public List<RevObjectEntity> revRead(RevObjectEntity _revObjectEntity) {
        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        String[] projection = {
                FeedEntry_REV_ENTITY.REV_ENTITY_GUID,
                FeedEntry_REV_ENTITY.REV_OWNER_GUID,
                FeedEntry_REV_ENTITY.REV_CONTAINER_GUID,
                FeedEntry_REV_ENTITY.REV_TYPE,
                FeedEntry_REV_ENTITY.REV_SUBTYPE,
                FeedEntry_REV_ENTITY.REV_CREATED_DATE,
                FeedEntry_REV_ENTITY.REV_UPDATED_DATE
        };

        // Filter results WHERE "title" = 'My Title'
        String selection = FeedEntry_REV_ENTITY.REV_SUBTYPE + " = ?";
        String[] selectionArgs = {_revObjectEntity.get_revEntitySubType()};

        // How you want the results sorted in the resulting Cursor
        String sortOrder =
                FeedEntry_REV_ENTITY.REV_CREATED_DATE + " ASC";

        Cursor cursor = db.query(
                FeedEntry_REV_ENTITY.TABLE_NAME,                     // The table to query
                projection,                                                  // The columns to return
                selection,                                                   // The columns for the WHERE clause
                selectionArgs,                                          // The values for the WHERE clause
                null,                                     // don't group the rows
                null,                                        // don't filter by row groups
                sortOrder                                                 // The sort order
        );

        List<RevObjectEntity> itemIds = new ArrayList<>();
        /**
        while (cursor.moveToNext()) {
            long entityGUID = cursor.getLong(cursor.getColumnIndexOrThrow(FeedEntry_REV_ENTITY.REV_ENTITY_GUID));
            long entityOwnerGUID = cursor.getLong(cursor.getColumnIndexOrThrow(FeedEntry_REV_ENTITY.REV_OWNER_GUID));
            long entityContainerGUID = cursor.getLong(cursor.getColumnIndexOrThrow(FeedEntry_REV_ENTITY.REV_CONTAINER_GUID));
            String entityType = cursor.getString(cursor.getColumnIndex(FeedEntry_REV_ENTITY.REV_TYPE));
            String entitySubType = cursor.getString(cursor.getColumnIndex(FeedEntry_REV_ENTITY.REV_SUBTYPE));
            String dateCreated = cursor.getString(cursor.getColumnIndex(FeedEntry_REV_ENTITY.REV_CREATED_DATE));
            String dateUpdated = cursor.getString(cursor.getColumnIndex(FeedEntry_REV_ENTITY.REV_UPDATED_DATE));

            RevObjectEntity revObjectEntity = new RevObjectEntity();
            revObjectEntity.set_revEntityGUID(entityGUID);
            revObjectEntity.set_revEntityOwnerGUID(entityOwnerGUID);
            revObjectEntity.set_revEntityContainerGUID(entityContainerGUID);
            revObjectEntity.set_revEntityType(entityType);
            revObjectEntity.set_revEntitySubType(entitySubType);

            itemIds.add(revObjectEntity);
        }
        **/
        cursor.close();

        // Collections.sort(itemIds, Collections.reverseOrder());

        return itemIds;
    }

    public List<Long> revRead(String subType) {
        this.checkDbOpen();

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        String[] projection = {
                FeedEntry_REV_ENTITY.REV_ENTITY_GUID,
        };

        // Filter results WHERE "title" = 'My Title'
        String selection = FeedEntry_REV_ENTITY.REV_SUBTYPE + " = ?";
        String[] selectionArgs = {subType};

        // How you want the results sorted in the resulting Cursor
        String sortOrder =
                FeedEntry_REV_ENTITY.REV_CREATED_DATE + " DESC";

        Cursor cursor = db.query(
                FeedEntry_REV_ENTITY.TABLE_NAME,                     // The table to query
                projection,                                                  // The columns to return
                selection,                                                   // The columns for the WHERE clause
                selectionArgs,                                          // The values for the WHERE clause
                null,                                     // don't group the rows
                null,                                        // don't filter by row groups
                sortOrder                                                 // The sort order
        );

        List<Long> itemIds = new ArrayList<>();
        while (cursor.moveToNext()) {
            /**
            long entityGUID = cursor.getLong(cursor.getColumnIndexOrThrow(FeedEntry_REV_ENTITY.REV_ENTITY_GUID));
            itemIds.add(entityGUID);
            **/
        }
        cursor.close();

        // Collections.sort(itemIds, Collections.reverseOrder());

        return itemIds;
    }

    public List<Long> revRead(String subType, Long revContainerEntityGUID) {
        this.checkDbOpen();

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        String[] projection = {
                FeedEntry_REV_ENTITY.REV_ENTITY_GUID,
        };

        // Filter results WHERE "title" = 'My Title'
        String selection = FeedEntry_REV_ENTITY.REV_SUBTYPE + " = ?" + " AND " + FeedEntry_REV_ENTITY.REV_CONTAINER_GUID + " = ?";
        String[] selectionArgs = {subType, String.valueOf(revContainerEntityGUID)};

        // How you want the results sorted in the resulting Cursor
        String sortOrder =
                FeedEntry_REV_ENTITY.REV_CREATED_DATE + " DESC";

        Cursor cursor = db.query(
                FeedEntry_REV_ENTITY.TABLE_NAME,                     // The table to query
                projection,                                                  // The columns to return
                selection,                                                   // The columns for the WHERE clause
                selectionArgs,                                          // The values for the WHERE clause
                null,                                     // don't group the rows
                null,                                        // don't filter by row groups
                sortOrder                                                 // The sort order
        );

        List<Long> itemIds = new ArrayList<>();
        /**
        while (cursor.moveToNext()) {
            long entityGUID = cursor.getLong(cursor.getColumnIndexOrThrow(FeedEntry_REV_ENTITY.REV_ENTITY_GUID));
            itemIds.add(entityGUID);
        }
        **/
        cursor.close();

        // Collections.sort(itemIds, Collections.reverseOrder());

        return itemIds;
    }

    public List revRead_getRevEntityGUIDList_REV_CONTAINER_ENTITY_CHILDREN_GUID(Long revEntityContainerGUID) {
        this.checkDbOpen();

        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        String[] projection = {
                FeedEntry_REV_ENTITY.REV_ENTITY_GUID,
        };

        // Filter results WHERE "title" = 'My Title'
        String selection = FeedEntry_REV_ENTITY.REV_CONTAINER_GUID + " = ?";
        String[] selectionArgs = {String.valueOf(revEntityContainerGUID)};

        // How you want the results sorted in the resulting Cursor
        String sortOrder =
                FeedEntry_REV_ENTITY.REV_CREATED_DATE + " ASC";

        Cursor cursor = db.query(
                FeedEntry_REV_ENTITY.TABLE_NAME,                     // The table to query
                projection,                                                  // The columns to return
                selection,                                                   // The columns for the WHERE clause
                selectionArgs,                                          // The values for the WHERE clause
                null,                                     // don't group the rows
                null,                                        // don't filter by row groups
                sortOrder                                                 // The sort order
        );

        List itemIds = new ArrayList<>();
        while (cursor.moveToNext()) {
            /**
            long entityGUID = cursor.getLong(cursor.getColumnIndexOrThrow(FeedEntry_REV_ENTITY.REV_ENTITY_GUID));
            itemIds.add(entityGUID);
            **/
        }
        cursor.close();

        return itemIds;
    }
}
