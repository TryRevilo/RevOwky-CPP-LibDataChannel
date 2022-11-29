package rev.ca.rev_lib_gen_functions;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.inputmethod.InputMethodManager;

/**
 * Created by rev on 10/23/17.
 */

public class RevViewsBaseFunctions {

    public static DisplayMetrics getRevDisplayMetrics() {
        DisplayMetrics dm = new DisplayMetrics();
        RevLibGenConstantine.REV_ACTIVITY.getWindowManager().getDefaultDisplay().getMetrics(dm);
        return dm;
    }

    public static int getRevCoreAppPageWidth() {
        return getRevDisplayMetrics().widthPixels;
    }

    public static int getRevCoreAppPageHeight() {
        return getRevDisplayMetrics().heightPixels;
    }

    public static void hideKeyboard(Activity activity) {
        InputMethodManager imm = (InputMethodManager) activity.getSystemService(Activity.INPUT_METHOD_SERVICE);
        //Find the currently focused view, so we can grab the correct window token from it.
        View view = activity.getCurrentFocus();
        //If no view currently has focus, create a new one, just so we can grab a window token from it
        if (view == null) {
            view = new View(activity);
        }
        imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
    }
}
