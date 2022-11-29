package rev.ca.rev_lib_gen_functions;

import android.app.Activity;
import android.content.Context;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

/**
 * Created by rev on 10/8/17.
 */

public class RevBaseViewSettings {

    public static void topLevelFocus(Context context) {
        if (Activity.class.isAssignableFrom(context.getClass())) {
            ViewGroup tlView = (ViewGroup) ((Activity) context).getWindow().getDecorView();
            if (tlView != null) {
                tlView.setFocusable(true);
                tlView.setFocusableInTouchMode(true);
                tlView.setDescendantFocusability(ViewGroup.FOCUS_BEFORE_DESCENDANTS);
            }
        }
    }

    public static void setFooterView_LP(View view) {
        LinearLayout.LayoutParams footerViewWrappedCct_LP = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        footerViewWrappedCct_LP.gravity = Gravity.BOTTOM;

        if (view != null)
            view.setLayoutParams(footerViewWrappedCct_LP);
    }
}
