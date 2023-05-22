//
// Created by rev on 3/3/23.
//

#include "rev_gen_file_functions.h"

#include "../../../../libs/rev_curl/android-21/include/curl/curl.h"

#include <android/log.h>

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <errno.h>
#include <string.h>
#include <stdint.h>

#include <pthread.h>

#define BUFFER_SIZE (1024 * 1024) // 1 MB buffer size

int revCopyFile_MemoryMapped(const char *revSourcePath, const char *revDestPath) {
    // Open the source file for reading
    int source_fd = open(revSourcePath, O_RDONLY);
    if (source_fd == -1) {
        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> Error: revSourcePath: %s\n", revSourcePath);
        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> Error: revDestPath: %s\n", revDestPath);
        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> Error: Could not open source file: %s\n", strerror(errno));
        return 1;
    }

    // Get the size of the source file
    struct stat source_stat;
    if (fstat(source_fd, &source_stat) == -1) {
        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> Error: Could not get source file size: %s\n", strerror(errno));
        close(source_fd);
        return 1;
    }

    // Open the destination file for writing
    int destination_fd = open(revDestPath, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (destination_fd == -1) {
        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> Error: Could not open destination file: %s\n", strerror(errno));
        close(source_fd);
        return 1;
    }

    // Resize the destination file to the size of the source file
    if (ftruncate(destination_fd, source_stat.st_size) == -1) {
        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> Error: Could not resize destination file: %s\n", strerror(errno));
        close(source_fd);
        close(destination_fd);
        return 1;
    }

    // Map the source file into memory
    void *source_map = mmap(NULL, source_stat.st_size, PROT_READ, MAP_PRIVATE, source_fd, 0);
    if (source_map == MAP_FAILED) {
        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> Error: Could not map source file: %s\n", strerror(errno));
        close(source_fd);
        close(destination_fd);
        return 1;
    }

    // Map the destination file into memory
    void *destination_map = mmap(NULL, source_stat.st_size, PROT_WRITE, MAP_SHARED, destination_fd, 0);
    if (destination_map == MAP_FAILED) {
        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> Error: Could not map destination file: %s\n", strerror(errno));
        munmap(source_map, source_stat.st_size);
        close(source_fd);
        close(destination_fd);
        return 1;
    }

    // Copy the contents of the source file to the destination file
    size_t remaining_bytes = source_stat.st_size;
    size_t offset = 0;
    while (remaining_bytes > 0) {
        size_t bytes_to_copy = (remaining_bytes < BUFFER_SIZE) ? remaining_bytes : BUFFER_SIZE;
        memcpy(destination_map + offset, source_map + offset, bytes_to_copy);
        remaining_bytes -= bytes_to_copy;
        offset += bytes_to_copy;
    }

    // Unmap the files from memory
    munmap(source_map, source_stat.st_size);
    munmap(destination_map, source_stat.st_size);

    // Close the files
    close(source_fd);
    close(destination_fd);

    return 0;
}

int revCopyFile(const char *revSourcePath, const char *revDestPath) {
    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revSourcePath %s revDestPath %s - %d", revSourcePath, revDestPath, 1);

    FILE *sourceFile, *destinationFile;
    char ch;

    // Open the source file in read mode
    sourceFile = fopen(revSourcePath, "r");
    if (sourceFile == NULL) {
        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> Error opening the source file.\n");
        return 1;
    }

    // Open the destination file in write mode
    destinationFile = fopen(revDestPath, "w");
    if (destinationFile == NULL) {
        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> Error opening the destination file.\n");
        fclose(sourceFile);
        return 1;
    }

    // Copy the contents of the source file to the destination file
    while (!feof(sourceFile)) {
        ch = fgetc(sourceFile);
        if (ch != EOF) {
            fputc(ch, destinationFile);
        }
    }

    // Close the source and destination files
    fclose(sourceFile);
    fclose(destinationFile);

    printf("File copied successfully.\n");

    return 0;
}

int revCopyFileCURL(const char *revSourceURI, const char *revDestPath) {
    CURL *curl;
    FILE *fp;
    CURLcode res;

    /* open the file to copy */
    fp = fopen(revSourceURI, "rb");
    if (!fp) {
        __android_log_print(ANDROID_LOG_WARN, "MyApp", "Error opening source file\n");
        return 1;
    }

    /* initialize curl */
    curl = curl_easy_init();
    if (!curl) {
        __android_log_print(ANDROID_LOG_WARN, "MyApp", "Error initializing curl\n");
        fclose(fp);
        return 1;
    }

    /* set the URL to copy to */
    curl_easy_setopt(curl, CURLOPT_URL, revDestPath);

    /* set the file to write the output to */
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, fp);

    /* perform the request */
    res = curl_easy_perform(curl);
    if (res != CURLE_OK) {
        __android_log_print(ANDROID_LOG_WARN, "MyApp", "Error copying file: %s\n", curl_easy_strerror(res));
    }

    /* cleanup */
    curl_easy_cleanup(curl);
    fclose(fp);

    return 0;
}

void *revCopyThread(void *arg) {
    int src_fd = ((int *) arg)[0];
    int dest_fd = ((int *) arg)[1];
    size_t buffer_size = ((size_t *) arg)[2];
    off_t offset = ((off_t *) arg)[3];

    char *buffer = malloc(buffer_size);
    if (buffer == NULL) {
        fprintf(stderr, "Error: could not allocate buffer\n");
        exit(EXIT_FAILURE);
    }

    ssize_t bytes_read;
    while ((bytes_read = pread(src_fd, buffer, buffer_size, offset)) > 0) {
        ssize_t bytes_written = pwrite(dest_fd, buffer, bytes_read, offset);
        if (bytes_written == -1) {
            fprintf(stderr, "Error: could not write to destination file\n");
            exit(EXIT_FAILURE);
        }
        offset += bytes_written;
    }

    free(buffer);
    close(src_fd);
    close(dest_fd);

    return NULL;
}

void revCopyFileAsync(const char *revSourcePath, const char *revDestPath) {
    int src_fd = open(revSourcePath, O_RDONLY);
    if (src_fd == -1) {
        fprintf(stderr, "Error: could not open source file\n");
        exit(EXIT_FAILURE);
    }

    int dest_fd = open(revDestPath, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (dest_fd == -1) {
        fprintf(stderr, "Error: could not open destination file\n");
        exit(EXIT_FAILURE);
    }

    off_t file_size = lseek(src_fd, 0, SEEK_END);

    pthread_t thread;
    int args[4] = {src_fd, dest_fd, BUFFER_SIZE, 0};
    pthread_create(&thread, NULL, revCopyThread, args);

    while (args[3] < file_size) {
        sleep(1);
    }

    pthread_join(thread, NULL);
}


char *revReadFileBytes(const char *filename, size_t *size) {
    int fd = open(filename, O_RDONLY);
    if (fd == -1) {
        printf("Failed to open file: %s\n", strerror(errno));
        return NULL;
    }

    struct stat st;
    if (fstat(fd, &st) == -1) {
        printf("Failed to get file size: %s\n", strerror(errno));
        close(fd);
        return NULL;
    }

    size_t page_size = sysconf(_SC_PAGESIZE);
    size_t map_size = (st.st_size / page_size + 1) * page_size;
    char *buffer = mmap(NULL, map_size, PROT_READ, MAP_PRIVATE | MAP_POPULATE, fd, 0);
    if (buffer == MAP_FAILED) {
        printf("Failed to map file: %s\n", strerror(errno));
        close(fd);
        return NULL;
    }

    *size = st.st_size;

    close(fd);

    return buffer;
}

const char *revGetFileExtension(const char *filename) {
    const char *last_dot = strrchr(filename, '.');
    const char *last_separator = strrchr(filename, '/');
    if (last_separator == NULL) {
        last_separator = strrchr(filename, '\\');
    }
    if (last_dot == NULL || last_dot < last_separator) {
        return NULL;
    } else {
        return last_dot + 1;
    }
}

#ifdef _WIN32
#define PATH_SEPARATOR '\\'
#else
#define PATH_SEPARATOR '/'
#endif

const char *revGetFileName(const char *filepath) {
    const char *filename = strrchr(filepath, PATH_SEPARATOR);
    if (filename == NULL) {
        filename = filepath;
    } else {
        filename++;  // skip the path separator character
    }

    printf("Filename: %s\n", filename);

    return filename;
}
