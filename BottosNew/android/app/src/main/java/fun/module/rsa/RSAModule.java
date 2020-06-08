package fun.module.rsa;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class RSAModule extends ReactContextBaseJavaModule {

    private static final String DEFAULT_PUBLIC_KEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgVybCU0BER5sBYwHVNPzNY+iIgKchmloieZfm5T8qDmSKoZNo6YnPj+LqfilmtMEPFa9jept3kmyMvYX4abx2RQpG1xlq9piMk+vG29b343uyzdOX85NwQJF7vB57gGRF9Cxo8eA+q9ScQo9xEhvh4Y4QVeoa4NaG1xqQ5EAKlQIDAQAB";

    private ReactApplicationContext context;
    private Callback callback;

    public RSAModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "RSAModule";
    }

    @ReactMethod
    private void encryptString(String content,Callback alertCallback) {
        callback = alertCallback;

        byte[] data = content.getBytes();

        try
        {
            byte[] encodedData = RSAUtils.encryptByPublicKey(data, DEFAULT_PUBLIC_KEY);
            String encodedString = Base64Utils.encode(encodedData);

            callback.invoke(encodedString);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            callback.invoke("");
        }
    }
}
