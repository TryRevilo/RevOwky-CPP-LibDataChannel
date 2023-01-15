package rev.ca.rev_lib_gen_functions;

public class RevLibGenFunctions {

    static {
        System.loadLibrary("Rev-Lib-Gen-Functions");
    }

    native public void revPingServer(String revIpAddress);
}
