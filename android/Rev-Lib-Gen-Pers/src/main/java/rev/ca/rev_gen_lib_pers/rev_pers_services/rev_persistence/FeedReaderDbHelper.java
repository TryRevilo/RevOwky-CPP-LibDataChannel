package rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderContract.FeedEntry_REV_ANNOTATIONS;
import rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderContract.FeedEntry_REV_CONTAINER_ENTITY;
import rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderContract.FeedEntry_REV_ENTITY;
import rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderContract.FeedEntry_REV_METASTRINGS;
import rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderContract.FeedEntry_REV_OBJECT_ENTITY;
import rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderContract.FeedEntry_REV_USER_ENTITY;

import static rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderContract.FeedEntry_REV_METADATA;

public class FeedReaderDbHelper extends SQLiteOpenHelper {
    // If you change the database schema, you must increment the database version.
    public static final int DATABASE_VERSION = 2;
    public static final String DATABASE_NAME = "rev.db";

    private static final String SQL_CREATE_REV_ENTITY_ENTRIES =
            "CREATE TABLE IF NOT EXISTS " + FeedEntry_REV_ENTITY.TABLE_NAME + " (" +
                    FeedEntry_REV_ENTITY.REV_ENTITY_GUID + " INTEGER PRIMARY KEY," +
                    FeedEntry_REV_ENTITY.REV_OWNER_GUID + " INTEGER ," +
                    FeedEntry_REV_ENTITY.REV_CONTAINER_GUID + " INTEGER ," +
                    FeedEntry_REV_ENTITY.REV_TYPE + " TEXT," +
                    FeedEntry_REV_ENTITY.REV_SUBTYPE + " TEXT," +
                    FeedEntry_REV_ENTITY.REV_CREATED_DATE + " DATE," +
                    FeedEntry_REV_ENTITY.REV_UPDATED_DATE + " DATE)";

    private static final String SQL_CREATE_REV_USER_ENTITY_ENTRIES =
            "CREATE TABLE IF NOT EXISTS " + FeedEntry_REV_USER_ENTITY.TABLE_NAME + " (" +
                    FeedEntry_REV_USER_ENTITY.REV_ENTITY_ID + " INTEGER PRIMARY KEY," +
                    FeedEntry_REV_USER_ENTITY.REV_ENTITY_GUID + " INTEGER," +
                    FeedEntry_REV_USER_ENTITY.REV_FULL_NAMES + " TEXT," +
                    FeedEntry_REV_USER_ENTITY.REV_EMAIL + " TEXT," +
                    FeedEntry_REV_USER_ENTITY.REV_PASSWORD + " TEXT," +
                    FeedEntry_REV_USER_ENTITY.REV_CREATED_DATE + " DATE," +
                    FeedEntry_REV_USER_ENTITY.REV_UPDATED_DATE + " DATE)";

    private static final String SQL_CREATE_REV_OBJECT_ENTITY_ENTRIES =
            "CREATE TABLE IF NOT EXISTS " + FeedEntry_REV_OBJECT_ENTITY.TABLE_NAME + " (" +
                    FeedEntry_REV_OBJECT_ENTITY.REV_ENTITY_ID + " INTEGER PRIMARY KEY," +
                    FeedEntry_REV_OBJECT_ENTITY.REV_ENTITY_GUID + " INTEGER ," +
                    FeedEntry_REV_OBJECT_ENTITY.REV_OWNER_ENTITY_GUID + " INTEGER ," +
                    FeedEntry_REV_OBJECT_ENTITY.REV_ENTITY_CONTAINER_GUID + " INTEGER ," +
                    FeedEntry_REV_OBJECT_ENTITY.REV_NAMES + " TEXT," +
                    FeedEntry_REV_OBJECT_ENTITY.REV_DESCRIPTION + " TEXT," +
                    FeedEntry_REV_OBJECT_ENTITY.REV_CREATED_DATE + " DATE," +
                    FeedEntry_REV_OBJECT_ENTITY.REV_UPDATED_DATE + " DATE)";

    private static final String SQL_CREATE_REV_CONTAINER_ENTITY_ENTRIES =
            "CREATE TABLE IF NOT EXISTS " + FeedEntry_REV_CONTAINER_ENTITY.TABLE_NAME + " (" +
                    FeedEntry_REV_CONTAINER_ENTITY.REV_ENTITY_ID + " INTEGER PRIMARY KEY," +
                    FeedEntry_REV_CONTAINER_ENTITY.REV_ENTITY_GUID + " INTEGER ," +
                    FeedEntry_REV_CONTAINER_ENTITY.REV_OWNER_ENTITY_GUID + " INTEGER ," +
                    FeedEntry_REV_CONTAINER_ENTITY.REV_ENTITY_CONTAINER_GUID + " INTEGER ," +
                    FeedEntry_REV_CONTAINER_ENTITY.REV_NAMES + " TEXT," +
                    FeedEntry_REV_CONTAINER_ENTITY.REV_DESCRIPTION + " TEXT," +
                    FeedEntry_REV_CONTAINER_ENTITY.REV_CREATED_DATE + " DATE," +
                    FeedEntry_REV_CONTAINER_ENTITY.REV_UPDATED_DATE + " DATE)";

    private static final String SQL_CREATE_ENTRIES_REV_METADATA =
            "CREATE TABLE IF NOT EXISTS " + FeedEntry_REV_METADATA.TABLE_NAME + " (" +
                    FeedEntry_REV_METADATA.COLUMN_METADATA_ID + " INTEGER PRIMARY KEY," +
                    FeedEntry_REV_METADATA.COLUMN_METADATA_VALUE_ID + " INTEGER," +
                    FeedEntry_REV_METADATA.COLUMN_METADATA_OWNER_GUID + " INTEGER ," +
                    FeedEntry_REV_METADATA.COLUMN_METADATA_NAME + " TEXT," +
                    FeedEntry_REV_METADATA.REV_CREATED_DATE + " TEXT," +
                    FeedEntry_REV_METADATA.REV_UPDATED_DATE + " TEXT)";

    private static final String SQL_CREATE_ENTRIES_REV_ANNOTATIONS =
            "CREATE TABLE IF NOT EXISTS " + FeedEntry_REV_ANNOTATIONS.TABLE_NAME + " (" +
                    FeedEntry_REV_ANNOTATIONS.COLUMN_ANNOTATION_ID + " INTEGER PRIMARY KEY," +
                    FeedEntry_REV_ANNOTATIONS.COLUMN_ANNOTATION_ENTITY_GUID + " INTEGER," +
                    FeedEntry_REV_ANNOTATIONS.COLUMN_ANNOTATION_OWNER_GUID + " INTEGER ," +
                    FeedEntry_REV_ANNOTATIONS.COLUMN_ANNOTATION_VALUE_ID + " TEXT," +
                    FeedEntry_REV_ANNOTATIONS.REV_CREATED_DATE + " TEXT," +
                    FeedEntry_REV_ANNOTATIONS.REV_UPDATED_DATE + " TEXT)";

    private static final String SQL_CREATE_ENTRIES_REV_METASTRINGS =
            "CREATE TABLE IF NOT EXISTS " + FeedEntry_REV_METASTRINGS.TABLE_NAME + " (" +
                    FeedEntry_REV_METASTRINGS.REV_ID + " INTEGER PRIMARY KEY," +
                    FeedEntry_REV_METASTRINGS.COLUMN_VALUE + " TEXT ," +
                    FeedEntry_REV_METASTRINGS.REV_CREATED_DATE + " DATE," +
                    FeedEntry_REV_METASTRINGS.REV_UPDATED_DATE + " DATE)";

    private static final String SQL_DELETE_REV_ENTITY_ENTRIES =
            "DROP TABLE IF EXISTS " + FeedEntry_REV_ENTITY.TABLE_NAME;
    private static final String SQL_DELETE_REV_USER_ENTITY_ENTRIES =
            "DROP TABLE IF EXISTS " + FeedEntry_REV_USER_ENTITY.TABLE_NAME;
    private static final String SQL_DELETE_REV_CONTAINER_ENTITY_ENTRIES =
            "DROP TABLE IF EXISTS " + FeedEntry_REV_CONTAINER_ENTITY.TABLE_NAME;
    private static final String SQL_DELETE_REV_OBJECT_ENTITY_ENTRIES =
            "DROP TABLE IF EXISTS " + FeedEntry_REV_OBJECT_ENTITY.TABLE_NAME;
    private static final String SQL_DELETE_ENTRIES_REV_ANNOTATIONS =
            "DROP TABLE IF EXISTS " + FeedEntry_REV_ANNOTATIONS.TABLE_NAME;
    private static final String SQL_DELETE_ENTRIES_REV_METADATA =
            "DROP TABLE IF EXISTS " + FeedEntry_REV_METADATA.TABLE_NAME;
    private static final String SQL_DELETE_ENTRIES_REV_METASTRINGS =
            "DROP TABLE IF EXISTS " + FeedEntry_REV_METASTRINGS.TABLE_NAME;

    public FeedReaderDbHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    public void onCreate(SQLiteDatabase db) {
        db.execSQL(SQL_CREATE_REV_ENTITY_ENTRIES);
        db.execSQL(SQL_CREATE_REV_USER_ENTITY_ENTRIES);
        db.execSQL(SQL_CREATE_REV_OBJECT_ENTITY_ENTRIES);
        db.execSQL(SQL_CREATE_REV_CONTAINER_ENTITY_ENTRIES);
        db.execSQL(SQL_CREATE_ENTRIES_REV_ANNOTATIONS);
        db.execSQL(SQL_CREATE_ENTRIES_REV_METADATA);
        db.execSQL(SQL_CREATE_ENTRIES_REV_METASTRINGS);
    }

    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        // This database is only a cache for online data, so its upgrade policy is
        // to simply to discard the data and start overTEXT
        db.execSQL(SQL_DELETE_REV_ENTITY_ENTRIES);
        db.execSQL(SQL_DELETE_REV_USER_ENTITY_ENTRIES);
        db.execSQL(SQL_DELETE_REV_OBJECT_ENTITY_ENTRIES);
        db.execSQL(SQL_DELETE_REV_CONTAINER_ENTITY_ENTRIES);
        db.execSQL(SQL_DELETE_ENTRIES_REV_ANNOTATIONS);
        db.execSQL(SQL_DELETE_ENTRIES_REV_METADATA);
        db.execSQL(SQL_DELETE_ENTRIES_REV_METASTRINGS);
        onCreate(db);
    }

    public void onDowngrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        onUpgrade(db, oldVersion, newVersion);
    }
}