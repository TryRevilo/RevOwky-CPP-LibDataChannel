package rev.ca.rev_gen_lib_pers.rev_pers_services.rev_persistence;

import android.provider.BaseColumns;

public final class FeedReaderContract {
    // To prevent someone from accidentally instantiating the contract class,
    // make the constructor private.
    private FeedReaderContract() {
    }

    // Inner class that defines the table contents
    public static class FeedEntry_REV_ENTITY implements BaseColumns {
        public static final String TABLE_NAME = "rev_entity";
        public static final String REV_ENTITY_GUID = "entity_GUID";
        public static final String REV_OWNER_GUID = "owner_GUID";
        public static final String REV_CONTAINER_GUID = "container_GUID";
        public static final String REV_TYPE = "rev_entity_type";
        public static final String REV_SUBTYPE = "rev_entity_sub_type";
        public static final String REV_CREATED_DATE = "date_created";
        public static final String REV_UPDATED_DATE = "date_updated";
    }

    // Inner class that defines the table contents
    public static class FeedEntry_REV_USER_ENTITY implements BaseColumns {
        public static final String TABLE_NAME = "rev_user_entity";
        public static final String REV_ENTITY_ID = "id";

        public static final String REV_ENTITY_GUID = "entity_GUID";
        public static final String REV_FULL_NAMES = "full_names";
        public static final String REV_EMAIL = "email";
        public static final String REV_PASSWORD = "password";
        public static final String REV_CREATED_DATE = "date_created";
        public static final String REV_UPDATED_DATE = "date_updated";
    }

    // Inner class that defines the table contents
    public static class FeedEntry_REV_OBJECT_ENTITY implements BaseColumns {
        public static final String TABLE_NAME = "rev_object";
        public static final String REV_ENTITY_ID = "id";

        public static final String REV_ENTITY_GUID = "entity_GUID";
        public static final String REV_OWNER_ENTITY_GUID = "owner_entity_GUID";
        public static final String REV_ENTITY_CONTAINER_GUID = "container_entity_GUID";

        public static final String REV_NAMES = "rev_object_name";
        public static final String REV_DESCRIPTION = "rev_object_description";

        public static final String REV_CREATED_DATE = "date_created";
        public static final String REV_UPDATED_DATE = "date_updated";
    }

    // Inner class that defines the table contents
    public static class FeedEntry_REV_CONTAINER_ENTITY implements BaseColumns {
        public static final String TABLE_NAME = "rev_container_entity";
        public static final String REV_ENTITY_ID = "id";

        public static final String REV_ENTITY_GUID = "entity_GUID";
        public static final String REV_OWNER_ENTITY_GUID = "owner_entity_GUID";
        public static final String REV_ENTITY_CONTAINER_GUID = "container_entity_GUID";

        public static final String REV_NAMES = "rev_object_name";
        public static final String REV_DESCRIPTION = "rev_object_description";

        public static final String REV_CREATED_DATE = "date_created";
        public static final String REV_UPDATED_DATE = "date_updated";
    }

    // Inner class that defines the table contents
    public static class FeedEntry_REV_METADATA implements BaseColumns {
        public static final String TABLE_NAME = "rev_metadata";
        public static final String COLUMN_METADATA_OWNER_GUID = "owner_GUID";
        public static final String COLUMN_METADATA_NAME = "matadata_name";
        public static final String COLUMN_METADATA_ID = "metadata_id";
        public static final String COLUMN_METADATA_VALUE_ID = "value_id";
        public static final String REV_CREATED_DATE = "date_created";
        public static final String REV_UPDATED_DATE = "date_updated";
    }

    // Inner class that defines the table contents
    public static class FeedEntry_REV_ANNOTATIONS implements BaseColumns {
        public static final String TABLE_NAME = "rev_annotations";
        public static final String COLUMN_ANNOTATION_ENTITY_GUID = "entity_GUID";
        public static final String COLUMN_ANNOTATION_OWNER_GUID = "owner_GUID";
        public static final String COLUMN_ANNOTATION_ID = "annotation_id";
        public static final String COLUMN_ANNOTATION_VALUE_ID = "annotation_value_id";
        public static final String REV_CREATED_DATE = "date_created";
        public static final String REV_UPDATED_DATE = "date_updated";
    }

    // Inner class that defines the table contents
    public static class FeedEntry_REV_METASTRINGS implements BaseColumns {
        public static final String TABLE_NAME = "rev_meta_strings";
        public static final String REV_ID = "id";
        public static final String COLUMN_VALUE = "value";
        public static final String REV_CREATED_DATE = "date_created";
        public static final String REV_UPDATED_DATE = "date_updated";
    }
}
