cmake_minimum_required(VERSION 3.6.0)
## cmake_minimum_required(VERSION 3.18.1)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=gnu++17")

project(rev-gen-lib-pers)

############################################################################

# build application's shared lib
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=gnu++17")

find_library( # Sets the name of the path variable.
        log-lib

        # Specifies the name of the NDK library that
        # you want CMake to locate.
        log)

## Set JNI Root Dir
set(REV_JNI_ROOT_DIR ${CMAKE_CURRENT_SOURCE_DIR}/src/main/jni)

## Set CPP Root Dir
set(REV_CPP_ROOT_DIR ${CMAKE_CURRENT_SOURCE_DIR}/src/main/cpp)

## configure import libs
set(REV_LIBS_DIR ${CMAKE_CURRENT_SOURCE_DIR}/libs)

include_directories(${REV_LIBS_DIR}/gmath/include)
## END GMATH ##

## START GPERF ##
add_library(lib_gperf SHARED IMPORTED)
set_target_properties(lib_gperf PROPERTIES
        IMPORTED_LOCATION ${REV_LIBS_DIR}/gperf/lib/${ANDROID_ABI}/libgperf.so
        )
include_directories(${REV_LIBS_DIR}/gperf/include)
## END GPERF ##

## START REV LIST ##
add_library(rev_list SHARED ${REV_LIBS_DIR}/rev_list/rev_linked_list.c)
include_directories(${REV_LIBS_DIR}/rev_list)
## END REV LIST ##

## START REV MAP ##
add_library(rev_map SHARED ${REV_LIBS_DIR}/rev_map/rev_map.c)
include_directories(${REV_LIBS_DIR}/rev_map)
## END REV MAP ##

## START CJSON ##
add_library(rev_c_json SHARED ${REV_LIBS_DIR}/cJSON/cJSON.c)
include_directories(${REV_LIBS_DIR}/cJSON)
## END REV CJSON ##

## START REV SQLITE3 ##
set(REV_SQLITE3_DIR ${REV_LIBS_DIR}/sqlite3)
add_library(sqlite3_base STATIC IMPORTED)
set_target_properties(sqlite3_base PROPERTIES
        IMPORTED_LOCATION ${REV_SQLITE3_DIR}/lib/${ANDROID_ABI}/libsqlite3.a
        )
include_directories(${REV_SQLITE3_DIR}/include)
## END REV SQLITE3 ##

## START REV EXT LIBS
set(REV_LIBS_EXT_PROJECT_SOURCE_DIR ${REV_CPP_ROOT_DIR}/rev_gen_functions)
set(REV_LIBS_EXT_SRCS
        ${REV_LIBS_EXT_PROJECT_SOURCE_DIR}/rev_gen_functions.c
        ${REV_LIBS_EXT_PROJECT_SOURCE_DIR}/rev_gen_functions.h
        ${REV_JNI_ROOT_DIR}/rev_pers_react_native_events.hpp
        ${REV_JNI_ROOT_DIR}/rev_pers_react_native_events.cpp
        ${REV_JNI_ROOT_DIR}/rev_init_jni_lib.hpp
        ${REV_JNI_ROOT_DIR}/rev_init_jni_lib.cpp
        )

add_library(rev_pers_lib_includes SHARED ${REV_LIBS_EXT_SRCS})
target_link_libraries(
        rev_pers_lib_includes
        rev_list
        rev_map
        rev_c_json
        sqlite3_base
        lib_gperf

        ${log-lib}
)


## START ADD nlohmann TO ALL PROJECTS ##
# - -
include_directories(${REV_LIBS_DIR}/nlohmann)

## END ADD nlohmann TO ALL PROJECTS ##


############################################################################
## START NET LIBS ##

## LIB CURL
set(REV_CURL_LIBS_DIR ${CMAKE_CURRENT_SOURCE_DIR}/libs/rev_curl/android-21)
add_library(rev_curl STATIC IMPORTED)
set_target_properties(rev_curl PROPERTIES
        IMPORTED_LOCATION ${REV_CURL_LIBS_DIR}/${ANDROID_ABI}/lib/libcurl.a
        )
include_directories(
        ${REV_CURL_LIBS_DIR}/include
        ${REV_CURL_LIBS_DIR}/include/curl
)

## - - -
add_library(rev_pers_lib_server_files SHARED
        ${REV_CPP_ROOT_DIR}/rev_files/rev_gen_file_functions.h
        ${REV_CPP_ROOT_DIR}/rev_files/rev_gen_file_functions.c
        ${REV_CPP_ROOT_DIR}/rev_files/rev_curl_upload_file.h
        ${REV_CPP_ROOT_DIR}/rev_files/rev_curl_upload_file.c)
target_link_libraries(
        rev_pers_lib_server_files
        rev_pers_lib_includes
        rev_curl

        ${log-lib})
## - - -
set(REV_LIB_NET_SRCS
        ${REV_CPP_ROOT_DIR}/rev_net/rev_ping.cpp
        )
add_library(rev_lib_net SHARED ${REV_LIB_NET_SRCS})
## END NET LIBS ##

## START REV DB INIT
set(REV_DB_INIT_PROJECT_SOURCE_DIR ${REV_CPP_ROOT_DIR}/rev_pers_lib/rev_db_init)

set(REV_DB_INIT_SRCS
        ${REV_DB_INIT_PROJECT_SOURCE_DIR}/rev_db_init.c
        ${REV_DB_INIT_PROJECT_SOURCE_DIR}/rev_db_init.h
        )
add_library(rev_db_init SHARED ${REV_DB_INIT_SRCS})
target_link_libraries(
        rev_db_init
        rev_pers_lib_includes

        ${log-lib})

## START REV PERS LIB CONNECTORS
set(REV_PERS_LIB_CONNECTORS_PROJECT_SOURCE_DIR ${REV_CPP_ROOT_DIR}/rev_pers_lib/rev_pers_lib_connectors)
set(REV_LIB_CONNECTORS_SRCS
        ${REV_PERS_LIB_CONNECTORS_PROJECT_SOURCE_DIR}/rev_perslib_create_init.c
        ${REV_PERS_LIB_CONNECTORS_PROJECT_SOURCE_DIR}/rev_perslib_create_init.h
        )
add_library(rev_lib_connectors SHARED ${REV_LIB_CONNECTORS_SRCS})

## START REV OBJECT ENTITY

set(REV_OBJECT_PROJECT_SOURCE_DIR ${REV_CPP_ROOT_DIR}/rev_pers_lib/rev_entity/rev_pers_rev_object_entity)

set(REV_OBJECT_ENTITY_SRCS
        ${REV_OBJECT_PROJECT_SOURCE_DIR}/rev_db_models/rev_entity_object.h
        ${REV_OBJECT_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/FEED_ENTRY_REV_OBJECT_ENTITY.c
        ${REV_OBJECT_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/FEED_ENTRY_REV_OBJECT_ENTITY.h
        ${REV_OBJECT_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/rev_object_entity_feedreaderdbhelper.c
        ${REV_OBJECT_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/rev_object_entity_feedreaderdbhelper.h
        ${REV_OBJECT_PROJECT_SOURCE_DIR}/rev_pers_lib_create/rev_pers_create/rev_pers_rev_object_entity.c
        ${REV_OBJECT_PROJECT_SOURCE_DIR}/rev_pers_lib_create/rev_pers_create/rev_pers_rev_object_entity.h
        ${REV_OBJECT_PROJECT_SOURCE_DIR}/rev_pers_lib_read/rev_pers_read/rev_pers_read_rev_object_entity.c
        ${REV_OBJECT_PROJECT_SOURCE_DIR}/rev_pers_lib_read/rev_pers_read/rev_pers_read_rev_object_entity.h
        )
add_library(rev_pers_rev_object_entity SHARED ${REV_OBJECT_ENTITY_SRCS})
target_link_libraries(
        rev_pers_rev_object_entity
        rev_pers_lib_includes
        rev_db_init

        ${log-lib})

## START REV GROUP ENTITY

set(REV_GROUP_ENTITY_PROJECT_SOURCE_DIR ${REV_CPP_ROOT_DIR}/rev_pers_lib/rev_entity/rev_pers_rev_group_entity)
set(REV_GROUP_ENTITY_SRCS
        ${REV_GROUP_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_rev_group_entity.c
        ${REV_GROUP_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_rev_group_entity.h
        ${REV_GROUP_ENTITY_PROJECT_SOURCE_DIR}/db_create/FEED_ENTRY_REV_GROUP_ENTITY.c
        ${REV_GROUP_ENTITY_PROJECT_SOURCE_DIR}/db_create/FEED_ENTRY_REV_GROUP_ENTITY.h
        ${REV_GROUP_ENTITY_PROJECT_SOURCE_DIR}/db_create/rev_group_entity_feedreaderdbhelper.c
        ${REV_GROUP_ENTITY_PROJECT_SOURCE_DIR}/db_create/rev_group_entity_feedreaderdbhelper.h
        ${REV_GROUP_ENTITY_PROJECT_SOURCE_DIR}/rev_db_models/rev_entity_group.h
        ${REV_GROUP_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_read/rev_pers_read_rev_group_entity.c
        ${REV_GROUP_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_read/rev_pers_read_rev_group_entity.h
        )
add_library(rev_pers_rev_group_entity SHARED ${REV_GROUP_ENTITY_SRCS})
target_link_libraries(
        rev_pers_rev_group_entity
        rev_pers_lib_includes
        rev_db_init

        ${log-lib})

## START REV USER ENTITY

set(REV_USER_ENTITY_PROJECT_SOURCE_DIR ${REV_CPP_ROOT_DIR}/rev_pers_lib/rev_entity/rev_pers_rev_user_entity)
set(REV_USER_ENTITY_PROJECT_SOURCE_DIR
        ${REV_USER_ENTITY_PROJECT_SOURCE_DIR}/rev_db_models/rev_entity_user.h
        ${REV_USER_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/FEED_ENTRY_REV_USER_ENTITY.c
        ${REV_USER_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/FEED_ENTRY_REV_USER_ENTITY.h
        ${REV_USER_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/rev_user_entity_feedreaderdbhelper.c
        ${REV_USER_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/rev_user_entity_feedreaderdbhelper.h
        ${REV_USER_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_lib_create/rev_pers_create/rev_pers_rev_user_entity.c
        ${REV_USER_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_lib_create/rev_pers_create/rev_pers_rev_user_entity.h
        ${REV_USER_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_lib_read/rev_pers_read/rev_pers_read_rev_user_entity.c
        ${REV_USER_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_lib_read/rev_pers_read/rev_pers_read_rev_user_entity.h
        )
add_library(rev_pers_rev_user_entity SHARED ${REV_USER_ENTITY_PROJECT_SOURCE_DIR})
target_link_libraries(
        rev_pers_rev_user_entity
        rev_pers_lib_includes
        rev_db_init

        ${log-lib})

####################################################
## DATA

## START REV ENTITY METASTRINGS

set(REV_ENTITY_METASTRINGS_PROJECT_SOURCE_DIR ${REV_CPP_ROOT_DIR}/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metastrings)
set(REV_ENTITY_METASTRINGS_SRCS
        ${REV_ENTITY_METASTRINGS_PROJECT_SOURCE_DIR}/rev_db_models/rev_entity_metastrings.h
        ${REV_ENTITY_METASTRINGS_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/FEED_ENTRY_REV_ENTITY_METASTRING.c
        ${REV_ENTITY_METASTRINGS_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/FEED_ENTRY_REV_ENTITY_METASTRING.h
        ${REV_ENTITY_METASTRINGS_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/rev_entity_metastring_feedreaderdbhelper.c
        ${REV_ENTITY_METASTRINGS_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/rev_entity_metastring_feedreaderdbhelper.h
        ${REV_ENTITY_METASTRINGS_PROJECT_SOURCE_DIR}/rev_pers_lib_create/rev_pers_create/rev_pers_rev_entity_metastrings.c
        ${REV_ENTITY_METASTRINGS_PROJECT_SOURCE_DIR}/rev_pers_lib_create/rev_pers_create/rev_pers_rev_entity_metastrings.h
        ${REV_ENTITY_METASTRINGS_PROJECT_SOURCE_DIR}/rev_pers_read/rev_pers_read_rev_entity_metastrings.c
        ${REV_ENTITY_METASTRINGS_PROJECT_SOURCE_DIR}/rev_pers_read/rev_pers_read_rev_entity_metastrings.h
        )
add_library(rev_pers_entity_metastrings SHARED ${REV_ENTITY_METASTRINGS_SRCS})
target_link_libraries(
        rev_pers_entity_metastrings
        rev_pers_lib_includes
        rev_db_init

        ${log-lib})

## START REV ENTITY METADATA

set(REV_ENTITY_METADATA_PROJECT_SOURCE_DIR ${REV_CPP_ROOT_DIR}/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata)
set(REV_ENTITY_METADATA_SRCS
        ${REV_ENTITY_METADATA_PROJECT_SOURCE_DIR}/rev_db_models/rev_entity_metadata.h
        ${REV_ENTITY_METADATA_PROJECT_SOURCE_DIR}/rev_db_models/rev_entity_metadata.c
        ${REV_ENTITY_METADATA_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/FEED_ENTRY_REV_ENTITY_METADATA.c
        ${REV_ENTITY_METADATA_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/FEED_ENTRY_REV_ENTITY_METADATA.h
        ${REV_ENTITY_METADATA_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/rev_entity_metadata_feedreaderdbhelper.c
        ${REV_ENTITY_METADATA_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/rev_entity_metadata_feedreaderdbhelper.h
        ${REV_ENTITY_METADATA_PROJECT_SOURCE_DIR}/rev_pers_lib_create/rev_pers_create/rev_pers_rev_entity_metadata.c
        ${REV_ENTITY_METADATA_PROJECT_SOURCE_DIR}/rev_pers_lib_create/rev_pers_create/rev_pers_rev_entity_metadata.h
        ${REV_ENTITY_METADATA_PROJECT_SOURCE_DIR}/rev_pers_read/rev_pers_read_rev_entity_metadata.c
        ${REV_ENTITY_METADATA_PROJECT_SOURCE_DIR}/rev_pers_read/rev_pers_read_rev_entity_metadata.h
        ${REV_ENTITY_METADATA_PROJECT_SOURCE_DIR}/rev_pers_update/rev_pers_update_rev_entity_metadata.c
        ${REV_ENTITY_METADATA_PROJECT_SOURCE_DIR}/rev_pers_update/rev_pers_update_rev_entity_metadata.h
        )
add_library(rev_pers_rev_entity_metadata SHARED ${REV_ENTITY_METADATA_SRCS})
target_link_libraries(
        rev_pers_rev_entity_metadata
        rev_pers_lib_includes
        rev_db_init
        rev_pers_entity_metastrings

        ${log-lib})

## START REV ENTITY RELATIONSHIPS

set(REV_ENTITY_RELATIONSHIPS_PROJECT_SOURCE_DIR ${REV_CPP_ROOT_DIR}/rev_pers_lib/rev_entity_data/rev_pers_relationships)
set(REV_RELATIONSHIPS_ENTITY_SRCS
        ${REV_ENTITY_RELATIONSHIPS_PROJECT_SOURCE_DIR}/rev_db_models/rev_entity_relationships.h
        ${REV_ENTITY_RELATIONSHIPS_PROJECT_SOURCE_DIR}/rev_db_models/rev_entity_relationships.c
        ${REV_ENTITY_RELATIONSHIPS_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/FEED_ENTRY_REV_ENTITY_RELATIONSHIPS.c
        ${REV_ENTITY_RELATIONSHIPS_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/FEED_ENTRY_REV_ENTITY_RELATIONSHIPS.h
        ${REV_ENTITY_RELATIONSHIPS_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/rev_entity_relationships_feedreaderdbhelper.c
        ${REV_ENTITY_RELATIONSHIPS_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/rev_entity_relationships_feedreaderdbhelper.h
        ${REV_ENTITY_RELATIONSHIPS_PROJECT_SOURCE_DIR}/rev_pers_lib_create/rev_pers_create/rev_pers_relationships.c
        ${REV_ENTITY_RELATIONSHIPS_PROJECT_SOURCE_DIR}/rev_pers_lib_create/rev_pers_create/rev_pers_relationships.h
        ${REV_ENTITY_RELATIONSHIPS_PROJECT_SOURCE_DIR}/rev_pers_read/rev_pers_read_rev_entity_relationships.c
        ${REV_ENTITY_RELATIONSHIPS_PROJECT_SOURCE_DIR}/rev_pers_read/rev_pers_read_rev_entity_relationships.h
        ${REV_ENTITY_RELATIONSHIPS_PROJECT_SOURCE_DIR}/rev_pers_update/rev_pers_update_rev_entity_rel.c
        ${REV_ENTITY_RELATIONSHIPS_PROJECT_SOURCE_DIR}/rev_pers_update/rev_pers_update_rev_entity_rel.h
        ${REV_ENTITY_RELATIONSHIPS_PROJECT_SOURCE_DIR}/rev_pers_delete/rev_pers_rel_delete.h
        ${REV_ENTITY_RELATIONSHIPS_PROJECT_SOURCE_DIR}/rev_pers_delete/rev_pers_rel_delete.c
        )
add_library(rev_pers_rev_entity_relationships SHARED ${REV_RELATIONSHIPS_ENTITY_SRCS})
target_link_libraries(
        rev_pers_rev_entity_relationships
        rev_pers_lib_includes
        rev_db_init
        rev_pers_entity_metastrings

        ${log-lib})

############################################################################

## START REV ENTITY ANNOTATIONS

set(REV_ENTITY_ANNOTATION_PROJECT_SOURCE_DIR ${REV_CPP_ROOT_DIR}/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_annotations)
set(REV_ENTITY_ANNOTATION_SRCS
        ${REV_ENTITY_ANNOTATION_PROJECT_SOURCE_DIR}/rev_db_models/rev_entity_annotation.h
        ${REV_ENTITY_ANNOTATION_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/FEED_ENTRY_REV_ENTITY_ANNOTATIONS.h
        ${REV_ENTITY_ANNOTATION_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/FEED_ENTRY_REV_ENTITY_ANNOTATIONS.c
        ${REV_ENTITY_ANNOTATION_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/rev_entity_annotation_feedreaderdbhelper.h
        ${REV_ENTITY_ANNOTATION_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/rev_entity_annotation_feedreaderdbhelper.c
        ${REV_ENTITY_ANNOTATION_PROJECT_SOURCE_DIR}/rev_pers_lib_create/rev_pers_create/rev_pers_annotation.h
        ${REV_ENTITY_ANNOTATION_PROJECT_SOURCE_DIR}/rev_pers_lib_create/rev_pers_create/rev_pers_annotation.c
        ${REV_ENTITY_ANNOTATION_PROJECT_SOURCE_DIR}/rev_pers_read/rev_pers_read_rev_entity_annotations.h
        ${REV_ENTITY_ANNOTATION_PROJECT_SOURCE_DIR}/rev_pers_read/rev_pers_read_rev_entity_annotations.c
        ${REV_ENTITY_ANNOTATION_PROJECT_SOURCE_DIR}/rev_pers_update/rev_pers_update_rev_entity_ann.h
        ${REV_ENTITY_ANNOTATION_PROJECT_SOURCE_DIR}/rev_pers_update/rev_pers_update_rev_entity_ann.c
        )
add_library(rev_pers_rev_entity_annotations SHARED ${REV_ENTITY_ANNOTATION_SRCS})
target_link_libraries(
        rev_pers_rev_entity_annotations
        rev_pers_lib_includes
        rev_db_init
        rev_pers_entity_metastrings

        ${log-lib})


############################################################################

## START REV TIMELINE

set(REV_TIMELINE_PROJECT_SOURCE_DIR ${REV_CPP_ROOT_DIR}/rev_pers_lib/rev_timeline)
set(REV_TIMELINE_SRCS
        ${REV_TIMELINE_PROJECT_SOURCE_DIR}/rev_db_models/rev_timeline.h
        ${REV_TIMELINE_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/rev_timeline_feedreaderdbhelper.c
        ${REV_TIMELINE_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/rev_timeline_feedreaderdbhelper.h
        ${REV_TIMELINE_PROJECT_SOURCE_DIR}/rev_pers_lib_create/rev_pers_create/rev_pers_rev_timeline.c
        ${REV_TIMELINE_PROJECT_SOURCE_DIR}/rev_pers_lib_create/rev_pers_create/rev_pers_rev_timeline.h
        ${REV_TIMELINE_PROJECT_SOURCE_DIR}/rev_pers_read/rev_pers_read_rev_timeline.h
        ${REV_TIMELINE_PROJECT_SOURCE_DIR}/rev_pers_read/rev_pers_read_rev_timeline.c
        )
add_library(rev_pers_rev_timeline SHARED ${REV_TIMELINE_SRCS})
target_link_libraries(
        rev_pers_rev_timeline
        rev_pers_lib_includes
        rev_db_init

        ${log-lib})

## START REV ENTITY
set(REV_ENTITY_PROJECT_SOURCE_DIR ${REV_CPP_ROOT_DIR}/rev_pers_lib/rev_entity/rev_pers_rev_entity)
set(REV_ENTITY_SRCS
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/rev_db_models/rev_entity.h
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/rev_db_models/rev_entity.c
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/init_rev_pers_rev_entity.c
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/init_rev_pers_rev_entity.h
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/rev_table_create.cpp
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/rev_table_create.h
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_delete/rev_pers_delete.c
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_delete/rev_pers_delete.h
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/FEED_ENTRY_REV_ENTITY.c
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/FEED_ENTRY_REV_ENTITY.h
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/rev_entity_feedreaderdbhelper.c
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_lib_create/db_create/rev_entity_feedreaderdbhelper.h
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_lib_create/rev_pers_create/rev_pers_rev_entity.c
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_lib_create/rev_pers_create/rev_pers_rev_entity.h
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_lib_read/rev_pers_read/rev_pers_read.c
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_lib_read/rev_pers_read/rev_pers_read.h
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_update/rev_pers_update.c
        ${REV_ENTITY_PROJECT_SOURCE_DIR}/rev_pers_update/rev_pers_update.h
        )
add_library(rev_pers_rev_entity SHARED ${REV_ENTITY_SRCS})
target_link_libraries(
        rev_pers_rev_entity
        rev_pers_lib_includes
        rev_db_init

        rev_pers_rev_object_entity
        rev_pers_rev_group_entity
        rev_pers_rev_user_entity
        rev_pers_entity_metastrings
        rev_pers_rev_entity_metadata
        rev_pers_rev_entity_relationships
        rev_pers_rev_entity_annotations
        rev_pers_rev_timeline

        ${log-lib})
target_link_libraries(
        rev_lib_connectors
        rev_pers_lib_includes
        rev_pers_rev_entity

        ${log-lib})

############################################################################
## CREATE ##
add_library(rev-pers-lib-db-create SHARED
        ${REV_JNI_ROOT_DIR}/rev-pers-lib-create.hpp
        ${REV_JNI_ROOT_DIR}/rev-pers-lib-create.cpp
        ${REV_JNI_ROOT_DIR}/rev_metadata_jni_loader.h
        ${REV_JNI_ROOT_DIR}/rev_metadata_jni_loader.cpp
        ${REV_JNI_ROOT_DIR}/rev_annotation_jni_loader.h
        ${REV_JNI_ROOT_DIR}/rev_annotation_jni_loader.cpp
        ${REV_JNI_ROOT_DIR}/rev_pers_entity_type_init/rev_pers_object_init.h
        ${REV_JNI_ROOT_DIR}/rev_pers_entity_type_init/rev_pers_object_init.cpp
        )
target_link_libraries(
        rev-pers-lib-db-create
        rev_pers_lib_includes
        rev_lib_connectors
        rev_pers_rev_entity

        rev_pers_lib_server_files
        rev_lib_net

        rev_db_init

        ${log-lib})


############################################################################
## READ ##

add_library(rev-pers-lib-db-read SHARED
        ${REV_JNI_ROOT_DIR}/rev_pers_jni_structs.h
        ${REV_JNI_ROOT_DIR}/rev-pers-lib-read.h
        ${REV_JNI_ROOT_DIR}/rev-pers-lib-read.cpp)
target_link_libraries(
        rev-pers-lib-db-read
        rev-pers-lib-db-create

        rev_pers_lib_includes

        ${log-lib})


############################################################################
## UPDATE ##

add_library(rev-pers-lib-db-update SHARED
        src/main/jni/rev_pers_jni_structs.h
        src/main/jni/rev-pers-lib-update.cpp)
target_link_libraries(
        rev-pers-lib-db-update
        rev-pers-lib-db-read
        rev-pers-lib-db-create

        rev_pers_lib_includes

        ${log-lib})


############################################################################
## DELETE ##

add_library(rev-pers-lib-db-delete SHARED
        ${REV_JNI_ROOT_DIR}/rev_pers_jni_structs.h
        ${REV_JNI_ROOT_DIR}/rev-pers-lib-delete.cpp)
target_link_libraries(
        rev-pers-lib-db-delete
        rev-pers-lib-db-update
        rev-pers-lib-db-read
        rev-pers-lib-db-create

        rev_pers_lib_includes

        ${log-lib})