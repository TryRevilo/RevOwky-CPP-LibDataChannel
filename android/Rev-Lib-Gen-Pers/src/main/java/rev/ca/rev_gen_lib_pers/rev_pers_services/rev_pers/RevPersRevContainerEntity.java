package rev.ca.rev_gen_lib_pers.rev_pers_services.rev_pers;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import java.util.ArrayList;
import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.rev_entity_subtypes.RevGroupEntity;
import rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence.FeedReaderContract.FeedEntry_REV_CONTAINER_ENTITY;

public class RevPersRevContainerEntity {

    private Context mContext;
    private SQLiteDatabase db;

    private RevPersRevEntity revPersRevEntity;

    public RevPersRevContainerEntity(Context context) {
        mContext = context;
        db = RevDbSet.getDb();

        revPersRevEntity = new RevPersRevEntity(mContext);
    }
}
