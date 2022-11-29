package rev.ca.rev_lib_gen_functions;

import android.util.Log;

import java.net.URL;

public class REV_STRINGS_BASE_FUNCTIONS {

    public static boolean REV_IS_NULL_OR_EMPTY_STRING(String str) {
        return (str == null || str.isEmpty());
    }

    public static void REV_CONSOLE_PRINT_LONG_STRING(String s) {
        int maxLogSize = 1000;
        for (int i = 0; i <= s.length() / maxLogSize; i++) {
            int start = i * maxLogSize;
            int end = (i + 1) * maxLogSize;
            end = end > s.length() ? s.length() : end;

            Log.v(RevLangStrings.REV_TAG, s.substring(start, end));
        }
    }

    public static String REV_GET_SHORT_STRING(String str, int revStringLength) {
        if (!REV_IS_NULL_OR_EMPTY_STRING(str) && str.length() > revStringLength) {
            return str.substring(0, revStringLength - 3) + "...";
        }
        return str;
    }

    public static String REV_GET_FIRST_NAME(String fullNames) {
        if (!REV_IS_NULL_OR_EMPTY_STRING(fullNames)) {
            return (fullNames.trim().split("\\s+"))[0];
        }
        return fullNames;
    }

    /* Returns true if url is valid */
    public static boolean REV_IS_VALID_URL(String url) {
        /* Try creating a valid URL */
        try {
            new URL(url).toURI();
            return true;
        }

        // If there was an Exception
        // while creating URL object
        catch (Exception e) {
            return false;
        }
    }
}
