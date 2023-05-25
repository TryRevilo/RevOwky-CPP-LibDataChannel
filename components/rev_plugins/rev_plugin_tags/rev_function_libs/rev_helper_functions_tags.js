import React from 'react';
import {NativeModules} from 'react-native';

const {RevPersLibUpdate_React} = NativeModules;

import {
  revStringEmpty,
  revReplaceWiteSpaces,
} from '../../../../rev_function_libs/rev_string_function_libs';

import {REV_METADATA_FILLER} from '../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

import {useRevSaveNewEntity} from '../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_create/revPersLibCreateCustomHooks';

export const revGetTag = revTagStr => {};
