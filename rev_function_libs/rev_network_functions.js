import {Platform} from 'react-native';

export const revPingOnMobile = ipAddress => {
  return new Promise(resolve => {
    if (Platform.OS === 'android') {
      // On Android, use the `ping` command provided by BusyBox
      const command = `/system/xbin/busybox ping -c 1 -w 1 ${ipAddress}`;
      exec(command, (error, stdout) => {
        if (error) {
          resolve(false);
        } else {
          const lines = stdout.trim().split('\n');
          const lastLine = lines[lines.length - 1];
          if (lastLine.endsWith('1 received')) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    } else {
      // On iOS, use the `ping` command provided by the system
      const command = `ping -c 1 -t 1 ${ipAddress}`;
      exec(command, error => {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    }
  });
};
