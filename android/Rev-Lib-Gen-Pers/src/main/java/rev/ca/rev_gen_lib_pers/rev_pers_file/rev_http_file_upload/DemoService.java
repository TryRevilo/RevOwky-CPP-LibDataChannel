package rev.ca.rev_gen_lib_pers.rev_pers_file.rev_http_file_upload;

import java.io.FileOutputStream;
import java.util.Base64;

public class DemoService {

    public String uploadImage(String image) {
        String result="false";

        //decode Base64 String to image
        try{
            FileOutputStream fos = new FileOutputStream("H:/image.jpg"); //change the path where you want to save the image
            byte byteArray[] = new byte[0];
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                byteArray = Base64.getDecoder().decode(image);
            }
            fos.write(byteArray);

            result="true";
            fos.close();
        }
        catch(Exception e){
            e.printStackTrace();
        }

        return result;
    }
}
