package rev.ca.rev_gen_lib_pers;

import com.google.gson.Gson;

public class RevJSONEntityConstructor {
    public String revObjectSerializer(Object revObject) {
        return new Gson().toJson(revObject);
    }
}
