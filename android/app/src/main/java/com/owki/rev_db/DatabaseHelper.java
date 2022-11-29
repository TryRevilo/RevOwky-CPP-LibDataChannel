package com.owki.rev_db;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibCreate;

public class DatabaseHelper extends SQLiteOpenHelper {

    public DatabaseHelper(Context context, String dbName, String dbPath) {
        super(new DatabaseContext(context, dbPath), dbName, null, 1);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        new RevPersLibCreate().revTablesInit();
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
    }

    @Override
    public synchronized void close() {
        super.close();
    }
}
