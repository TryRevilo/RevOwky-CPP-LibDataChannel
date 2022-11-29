package rev.ca.rev_lib_gen_functions;

import android.os.Build;

public class RevReqPerms {

    private static final int REQUEST_WRITE_PERMISSION = 786;

    public static void requestPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            RevLibGenConstantine.REV_ACTIVITY.requestPermissions(new String[]{android.Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_WRITE_PERMISSION);
        }
    }
}
