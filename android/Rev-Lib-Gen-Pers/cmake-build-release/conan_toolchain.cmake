

# Conan automatically generated toolchain file
# DO NOT EDIT MANUALLY, it will be overwritten

# Avoid including toolchain file several times (bad if appending to variables like
#   CMAKE_CXX_FLAGS. See https://github.com/android/ndk/issues/323
include_guard()

message(STATUS "Using Conan toolchain: ${CMAKE_CURRENT_LIST_FILE}")

if(${CMAKE_VERSION} VERSION_LESS "3.15")
    message(FATAL_ERROR "The 'CMakeToolchain' generator only works with CMake >= 3.15")
endif()








string(APPEND CONAN_CXX_FLAGS " -m64")
string(APPEND CONAN_C_FLAGS " -m64")
string(APPEND CONAN_SHARED_LINKER_FLAGS " -m64")
string(APPEND CONAN_EXE_LINKER_FLAGS " -m64")

add_compile_definitions(_GLIBCXX_USE_CXX11_ABI=0)


# Extra c, cxx, linkflags and defines


if(DEFINED CONAN_CXX_FLAGS)
  string(APPEND CMAKE_CXX_FLAGS_INIT " ${CONAN_CXX_FLAGS}")
endif()
if(DEFINED CONAN_C_FLAGS)
  string(APPEND CMAKE_C_FLAGS_INIT " ${CONAN_C_FLAGS}")
endif()
if(DEFINED CONAN_SHARED_LINKER_FLAGS)
  string(APPEND CMAKE_SHARED_LINKER_FLAGS_INIT " ${CONAN_SHARED_LINKER_FLAGS}")
endif()
if(DEFINED CONAN_EXE_LINKER_FLAGS)
  string(APPEND CMAKE_EXE_LINKER_FLAGS_INIT " ${CONAN_EXE_LINKER_FLAGS}")
endif()

get_property( _CMAKE_IN_TRY_COMPILE GLOBAL PROPERTY IN_TRY_COMPILE )
if(_CMAKE_IN_TRY_COMPILE)
    message(STATUS "Running toolchain IN_TRY_COMPILE")
    return()
endif()

set(CMAKE_FIND_PACKAGE_PREFER_CONFIG ON)

# Definition of CMAKE_MODULE_PATH
# The root (which is the default builddirs) path of dependencies in the host context
list(PREPEND CMAKE_MODULE_PATH "/home/rev/.conan/data/boost/1.80.0/_/_/package/56e85e048a237371c86d912df0dad3ef833e6dcd/" "/home/rev/.conan/data/zlib/1.2.13/_/_/package/d50a0d523d98c15bb147b18fa7d203887c38be8b/" "/home/rev/.conan/data/bzip2/1.0.8/_/_/package/b27e2b40bcb70be2e7d6f0e0c6e43e35c530f8d3/" "/home/rev/.conan/data/libbacktrace/cci.20210118/_/_/package/d50a0d523d98c15bb147b18fa7d203887c38be8b/")
# the generators folder (where conan generates files, like this toolchain)
list(PREPEND CMAKE_MODULE_PATH ${CMAKE_CURRENT_LIST_DIR})

# Definition of CMAKE_PREFIX_PATH, CMAKE_XXXXX_PATH
# The Conan local "generators" folder, where this toolchain is saved.
list(PREPEND CMAKE_PREFIX_PATH ${CMAKE_CURRENT_LIST_DIR} )
list(PREPEND CMAKE_LIBRARY_PATH "/home/rev/.conan/data/boost/1.80.0/_/_/package/56e85e048a237371c86d912df0dad3ef833e6dcd/lib" "/home/rev/.conan/data/zlib/1.2.13/_/_/package/d50a0d523d98c15bb147b18fa7d203887c38be8b/lib" "/home/rev/.conan/data/bzip2/1.0.8/_/_/package/b27e2b40bcb70be2e7d6f0e0c6e43e35c530f8d3/lib" "/home/rev/.conan/data/libbacktrace/cci.20210118/_/_/package/d50a0d523d98c15bb147b18fa7d203887c38be8b/lib")
list(PREPEND CMAKE_INCLUDE_PATH "/home/rev/.conan/data/boost/1.80.0/_/_/package/56e85e048a237371c86d912df0dad3ef833e6dcd/include" "/home/rev/.conan/data/zlib/1.2.13/_/_/package/d50a0d523d98c15bb147b18fa7d203887c38be8b/include" "/home/rev/.conan/data/bzip2/1.0.8/_/_/package/b27e2b40bcb70be2e7d6f0e0c6e43e35c530f8d3/include" "/home/rev/.conan/data/libbacktrace/cci.20210118/_/_/package/d50a0d523d98c15bb147b18fa7d203887c38be8b/include")





# Variables
# Variables  per configuration


# Preprocessor definitions
# Preprocessor definitions per configuration
