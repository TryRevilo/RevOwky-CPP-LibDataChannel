package rev.ca.rev_lib_gen_functions;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.util.Log;

import static android.content.ContentValues.TAG;

/**
 * Created by rev on 10/17/17.
 */

public class RevDrawablesResolver {

    public static Drawable getRevResDrawable(Context context, String resource_name) {
        try {
            int resId = context.getResources().getIdentifier(resource_name, "drawable", context.getPackageName());
            if (resId != 0) {
                return context.getResources().getDrawable(resId);
            }
        } catch (Exception e) {
            Log.e(TAG, "getDrawable - resource_name: " + resource_name);
            e.printStackTrace();
        }

        return null;
    }

    public static int getRevResColor(Context context, String resource_name) {
        try {
            int resId = context.getResources().getIdentifier(resource_name, "drawable", context.getPackageName());
            if (resId != 0) {
                return context.getResources().getColor(resId);
            }
        } catch (Exception e) {
            Log.e(TAG, "getDrawable - resource_name: " + resource_name);
            e.printStackTrace();
        }

        return Integer.parseInt(null);
    }
}
