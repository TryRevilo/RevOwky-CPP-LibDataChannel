//
// Created by rev on 3/3/23.
//

#include <stddef.h>

#ifndef OWKI_REV_GEN_FILE_FUNCTIONS_H
#define OWKI_REV_GEN_FILE_FUNCTIONS_H

#endif //OWKI_REV_GEN_FILE_FUNCTIONS_H

int revCopyFile(const char *revSourcePath, const char *revDestPath);

void revCopyFileAsync(const char *revSourcePath, const char *revDestPath);

int revCopyFile_MemoryMapped(const char *revSourcePath, const char *revDestPath);

int revCopyFileCURL(const char *revSourceURI, const char *revDestPath);

char *revReadFileBytes(const char *filename, size_t *size);

const char *revGetFileExtension(const char *filename);

const char *revGetFileName(const char *filepath);