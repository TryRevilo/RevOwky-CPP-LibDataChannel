import React from 'react';

import {PermissionsAndroid} from 'react-native';

export const requestCameraPermission = () => {
  try {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.INTERNET,
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_MEDIA_LOCATION,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
    ]).then(result => {
      if (
        result['android.permission.INTERNET'] &&
        result['android.permission.CAMERA'] &&
        result['android.permission.READ_CONTACTS'] &&
        result['android.permission.ACCESS_COARSE_LOCATION'] &&
        result['android.permission.ACCESS_FINE_LOCATION'] &&
        result['android.permission.ACCESS_MEDIA_LOCATION'] &&
        result['android.permission.WRITE_EXTERNAL_STORAGE'] &&
        result['android.permission.READ_EXTERNAL_STORAGE'] &&
        result['android.permission.READ_MEDIA_IMAGES'] &&
        result['android.permission.READ_MEDIA_VIDEO'] &&
        result['android.permission.READ_MEDIA_AUDIO'] === 'granted'
      ) {
        console.log('SUCCESS! Permissions Granted!');
      } else if (
        result['android.permission.INTERNET'] &&
        result['android.permission.CAMERA'] &&
        result['android.permission.READ_CONTACTS'] &&
        result['android.permission.ACCESS_COARSE_LOCATION'] &&
        result['android.permission.ACCESS_FINE_LOCATION'] &&
        result['android.permission.ACCESS_MEDIA_LOCATION'] &&
        result['android.permission.WRITE_EXTERNAL_STORAGE'] &&
        result['android.permission.READ_EXTERNAL_STORAGE'] &&
        result['android.permission.READ_MEDIA_IMAGES'] &&
        result['android.permission.READ_MEDIA_VIDEO'] &&
        result['android.permission.READ_MEDIA_AUDIO'] === 'never_ask_again'
      ) {
        console.log(
          'Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue',
        );
      }
    });
  } catch (err) {
    console.warn(err);
  }
};
