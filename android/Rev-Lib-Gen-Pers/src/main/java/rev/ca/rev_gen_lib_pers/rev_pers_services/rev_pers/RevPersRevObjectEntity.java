package rev.ca.rev_gen_lib_pers.rev_pers_services.rev_pers;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import java.util.ArrayList;
import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;
import rev.ca.rev_gen_lib_pers.RevDBModels.rev_entity_subtypes.RevObjectEntity;
import rev.ca.rev_lib_gen_functions.REV_TIME;
import rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderContract;
import rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderContract.FeedEntry_REV_OBJECT_ENTITY;

public class RevPersRevObjectEntity {

    private Context mContext;
    private SQLiteDatabase db;

    private RevPersRevEntity revPersRevEntity;

    public RevPersRevObjectEntity(Context context) {
        mContext = context;
        db = RevDbSet.getDb();

        revPersRevEntity = new RevPersRevEntity(mContext);
    }

    private void checkDbOpen() {
        if (!db.isOpen())
            db = RevDbSet.getDb();
    }

    public long saveRev(RevObjectEntity revObjectEntity) {
        this.checkDbOpen();

        long rowId;

        // Create a new map of values, where column names are the keys
        ContentValues values = new ContentValues();
        values.put(FeedEntry_REV_OBJECT_ENTITY.REV_ENTITY_GUID, revObjectEntity.get_revEntityGUID());
        values.put(FeedEntry_REV_OBJECT_ENTITY.REV_OWNER_ENTITY_GUID, revObjectEntity.get_revEntityOwnerGUID());
        values.put(FeedEntry_REV_OBJECT_ENTITY.REV_ENTITY_CONTAINER_GUID, revObjectEntity.get_revEntityContainerGUID());
        values.put(FeedEntry_REV_OBJECT_ENTITY.REV_NAMES, revObjectEntity.get_revObjectName());
        values.put(FeedEntry_REV_OBJECT_ENTITY.REV_DESCRIPTION, revObjectEntity.get_revObjectDescription());

        values.put(FeedReaderContract.FeedEntry_REV_OBJECT_ENTITY.REV_CREATED_DATE, REV_TIME.GET_REV_CURRENT_TIME());

        rowId = db.insert(FeedEntry_REV_OBJECT_ENTITY.TABLE_NAME, null, values);

        if (revObjectEntity.get_revEntityMetadataList() != null) {
            RevPersRevMetadata revPersRevMetadata = new RevPersRevMetadata(mContext);
            for (RevEntityMetadata revEntityMetadata : revObjectEntity.get_revEntityMetadataList()) {
                revEntityMetadata.setRevMetadataOwnerGUID(revObjectEntity.get_revEntityGUID());
                revPersRevMetadata.saveRevMetadata(revEntityMetadata);
            }
        }

        // Insert the new row, returning the primary key value of the new row
        return rowId;
    }

    public RevObjectEntity revReadRevObject_BY_GUID(long guid) {
        this.checkDbOpen();

        String[] projection = {
                FeedEntry_REV_OBJECT_ENTITY.REV_ENTITY_GUID,
                FeedEntry_REV_OBJECT_ENTITY.REV_OWNER_ENTITY_GUID,
                FeedEntry_REV_OBJECT_ENTITY.REV_ENTITY_CONTAINER_GUID,
                FeedEntry_REV_OBJECT_ENTITY.REV_NAMES,
                FeedEntry_REV_OBJECT_ENTITY.REV_DESCRIPTION,
                FeedEntry_REV_OBJECT_ENTITY.REV_CREATED_DATE,
                FeedEntry_REV_OBJECT_ENTITY.REV_UPDATED_DATE,
        };

        String selection = FeedEntry_REV_OBJECT_ENTITY.REV_ENTITY_GUID + " = ?";
        String[] selectionArgs = {String.valueOf(guid)};
        Cursor cursor = db.query(FeedEntry_REV_OBJECT_ENTITY.TABLE_NAME, projection, selection, selectionArgs, null, null, null);

        cursor.moveToFirst();

        /**
        if (cursor.moveToFirst()) {
            long entityGUID = cursor.getLong(cursor.getColumnIndexOrThrow(FeedEntry_REV_OBJECT_ENTITY.REV_ENTITY_GUID));
            long entityOwnerGUID = cursor.getLong(cursor.getColumnIndexOrThrow(FeedEntry_REV_OBJECT_ENTITY.REV_OWNER_ENTITY_GUID));
            long entityContainerGUID = cursor.getLong(cursor.getColumnIndexOrThrow(FeedEntry_REV_OBJECT_ENTITY.REV_ENTITY_CONTAINER_GUID));

            String revObjectName = cursor.getString(cursor.getColumnIndex(FeedEntry_REV_OBJECT_ENTITY.REV_NAMES));
            String revObjectDesc = cursor.getString(cursor.getColumnIndex(FeedEntry_REV_OBJECT_ENTITY.REV_DESCRIPTION));

            String dateCreated = cursor.getString(cursor.getColumnIndex(FeedEntry_REV_OBJECT_ENTITY.REV_CREATED_DATE));
            String dateUpdated = cursor.getString(cursor.getColumnIndex(FeedEntry_REV_OBJECT_ENTITY.REV_UPDATED_DATE));

            RevObjectEntity revObjectEntity = new RevObjectEntity();
            revObjectEntity.set_revEntityGUID(entityGUID);
            revObjectEntity.set_revEntityOwnerGUID(entityOwnerGUID);
            revObjectEntity.set_revEntityContainerGUID(entityContainerGUID);

//            revObjectEntity.set_revEntityType(revPersRevEntity.revReadEntityType(guid));
            revObjectEntity.set_revEntitySubType(revPersRevEntity.revReadEntitySubType(guid));

            revObjectEntity.set_revObjectName(revObjectName);
            revObjectEntity.set_revObjectDescription(revObjectDesc);

            return revObjectEntity;
        }
        **/
        cursor.close();

        return null;
    }

    public List<RevObjectEntity> getRevContainerEntityChildrenObjects(Long revContainerEntityGUID) {
        this.checkDbOpen();

        List<Long> revEntityGUIDsList = revPersRevEntity.revRead_getRevEntityGUIDList_REV_CONTAINER_ENTITY_CHILDREN_GUID(revContainerEntityGUID);
        ArrayList<RevObjectEntity> revObjectEntityList = new ArrayList<>();

        if (revEntityGUIDsList != null || revEntityGUIDsList.size() > 0) {
            for (Long revEntityGUID : revEntityGUIDsList) {
                revObjectEntityList.add(this.revReadRevObject_BY_GUID(revEntityGUID));
            }

            return revObjectEntityList;
        }

        return null;
    }
}
