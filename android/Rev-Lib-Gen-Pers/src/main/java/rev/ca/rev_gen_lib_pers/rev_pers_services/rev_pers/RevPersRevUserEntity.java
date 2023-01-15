package rev.ca.rev_gen_lib_pers.rev_pers_services.rev_pers;


import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import java.util.ArrayList;
import java.util.List;

import rev.ca.rev_lib_gen_functions.REV_TIME;
import rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderContract.FeedEntry_REV_ENTITY;
import rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderContract.FeedEntry_REV_USER_ENTITY;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;
import rev.ca.rev_gen_lib_pers.RevDBModels.rev_entity_subtypes.RevUserEntity;

public class RevPersRevUserEntity {

    private Context mContext;
    private SQLiteDatabase db;

    public RevPersRevUserEntity(Context context) {
        mContext = context;
        db = RevDbSet.getDb();
    }

    public long saveRev(RevUserEntity revUserEntity) {
        long revEntityGUID;
        // Create a new map of values, where column names are the keys
        ContentValues values = new ContentValues();
        values.put(FeedEntry_REV_USER_ENTITY.REV_ENTITY_GUID, revUserEntity.get_revEntityGUID());
        values.put(FeedEntry_REV_USER_ENTITY.REV_FULL_NAMES, revUserEntity.get_fullNames());
        values.put(FeedEntry_REV_USER_ENTITY.REV_EMAIL, revUserEntity.get_email());
        values.put(FeedEntry_REV_ENTITY.REV_CREATED_DATE, REV_TIME.GET_REV_CURRENT_TIME());

        revEntityGUID = db.insert(FeedEntry_REV_USER_ENTITY.TABLE_NAME, null, values);
        revUserEntity.set_revEntityGUID(revEntityGUID);

        if (revUserEntity.get_revEntityMetadataList() != null) {
            RevPersRevMetadata revPersRevMetadata = new RevPersRevMetadata(mContext);
            for (RevEntityMetadata revEntityMetadata : revUserEntity.get_revEntityMetadataList()) {
                revEntityMetadata.setRevMetadataOwnerGUID(revEntityGUID);
                revPersRevMetadata.saveRevMetadata(revEntityMetadata);
            }
        }

        // Insert the new row, returning the primary key value of the new row
        return revEntityGUID;
    }

    public List<RevUserEntity> revRead(RevUserEntity _revObjectEntity) {
        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        String[] projection = {
                FeedEntry_REV_USER_ENTITY.REV_ENTITY_GUID,
                FeedEntry_REV_USER_ENTITY.REV_CREATED_DATE,

                FeedEntry_REV_USER_ENTITY.REV_FULL_NAMES,
                FeedEntry_REV_USER_ENTITY.REV_EMAIL,
                FeedEntry_REV_USER_ENTITY.REV_PASSWORD
        };

        // Filter results WHERE "title" = 'My Title'
        String selection = FeedEntry_REV_USER_ENTITY.REV_EMAIL + " = ?";
        String[] selectionArgs = {_revObjectEntity.get_email()};

        Cursor cursor = db.query(
                FeedEntry_REV_USER_ENTITY.TABLE_NAME,                     // The table to query
                projection,                                                  // The columns to return
                selection,                                                   // The columns for the WHERE clause
                selectionArgs,                                          // The values for the WHERE clause
                null,                                     // don't group the rows
                null,                                        // don't filter by row groups
                null                                                 // The sort order
        );

        List<RevUserEntity> itemIds = new ArrayList<>();
        /**
        while (cursor.moveToNext()) {
            long entityGUID = cursor.getLong(cursor.getColumnIndexOrThrow(FeedEntry_REV_USER_ENTITY.REV_ENTITY_GUID));
            String dateCreated = cursor.getString(cursor.getColumnIndex(FeedEntry_REV_USER_ENTITY.REV_CREATED_DATE));
            String fullNames = cursor.getString(cursor.getColumnIndex(FeedEntry_REV_USER_ENTITY.REV_FULL_NAMES));
            String email = cursor.getString(cursor.getColumnIndex(FeedEntry_REV_USER_ENTITY.REV_EMAIL));

            RevUserEntity revUserEntity = (RevUserEntity) new RevEntity();
            revUserEntity.set_revEntityGUID(entityGUID);
            revUserEntity.set_fullNames(fullNames);
            revUserEntity.set_email(email);

            itemIds.add(revUserEntity);
        }
        **/
        cursor.close();

        // Collections.sort(itemIds, Collections.reverseOrder());

        return itemIds;
    }

    public RevUserEntity revReadUserData(String userEmail) {
        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        String[] projection = {
                FeedEntry_REV_USER_ENTITY.REV_ENTITY_GUID,
                FeedEntry_REV_USER_ENTITY.REV_CREATED_DATE,

                FeedEntry_REV_USER_ENTITY.REV_FULL_NAMES,
                FeedEntry_REV_USER_ENTITY.REV_EMAIL,
                FeedEntry_REV_USER_ENTITY.REV_PASSWORD
        };

        // Filter results WHERE "title" = 'My Title'
        String selection = FeedEntry_REV_USER_ENTITY.REV_EMAIL + " = ?";
        String[] selectionArgs = {userEmail};

        Cursor cursor = db.query(
                FeedEntry_REV_USER_ENTITY.TABLE_NAME,                     // The table to query
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

            long revGUID = cursor.getLong(cursor.getColumnIndex(FeedEntry_REV_USER_ENTITY.REV_ENTITY_GUID));
            String fullNames = cursor.getString(cursor.getColumnIndex(FeedEntry_REV_USER_ENTITY.REV_FULL_NAMES));
            String email = cursor.getString(cursor.getColumnIndex(FeedEntry_REV_USER_ENTITY.REV_EMAIL));
            String signupDate = cursor.getString(cursor.getColumnIndex(FeedEntry_REV_USER_ENTITY.REV_CREATED_DATE));

            RevUserEntity revUserEntity = new RevUserEntity();
            revUserEntity.set_revEntityGUID(revGUID);
            revUserEntity.set_fullNames(fullNames);
            revUserEntity.set_email(email);
            return revUserEntity;
        } else {
            Log.d("Error", "No record exists");
        }
        **/

        cursor.close();

        return null;
    }
}
