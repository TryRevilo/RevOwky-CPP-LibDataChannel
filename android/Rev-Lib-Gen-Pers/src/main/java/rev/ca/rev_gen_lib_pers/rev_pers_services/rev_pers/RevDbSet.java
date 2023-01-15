package rev.ca.rev_gen_lib_pers.rev_pers_services.rev_pers;

import android.database.sqlite.SQLiteDatabase;

import rev.ca.rev_lib_gen_functions.RevLibGenConstantine;
import rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderDbHelper;

public class RevDbSet {

    public static SQLiteDatabase getDb() {
        if (!db.isOpen())
            new RevDbSet();

        return db;
    }

    private static SQLiteDatabase db;

    public RevDbSet() {
        FeedReaderDbHelper mDbHelper = new FeedReaderDbHelper(RevLibGenConstantine.REV_CONTEXT);
        db = mDbHelper.getWritableDatabase();
    }
}