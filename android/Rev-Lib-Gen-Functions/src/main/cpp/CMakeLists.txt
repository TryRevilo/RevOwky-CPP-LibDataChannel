cmake_minimum_required(VERSION 3.6.0)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=gnu++17")

project("Rev-Lib-Gen-Functions")

set(REV_C_ROOT_FOLDER ${CMAKE_CURRENT_SOURCE_DIR}/rev_c)
add_library( Rev-Lib-Gen-Functions SHARED
        Rev-Lib-Gen-Functions.cpp
        ${REV_C_ROOT_FOLDER}/rev_ping.h
        ${REV_C_ROOT_FOLDER}/rev_ping.c
        ${REV_C_ROOT_FOLDER}/rev_gen_functions.h
        ${REV_C_ROOT_FOLDER}/rev_gen_functions.c)

find_library(log-lib log)

target_link_libraries(
        Rev-Lib-Gen-Functions

        ${log-lib})
