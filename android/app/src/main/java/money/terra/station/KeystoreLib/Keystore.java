package money.terra.station.KeystoreLib;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Base64;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.nio.charset.Charset;

import io.michaelrocks.paranoid.Obfuscate;

@Obfuscate
public class Keystore extends ReactContextBaseJavaModule {
    private final SharedPreferences preferences;
    private final Charset charset;
    private StorageCipher storageCipher = null;
    private static final String ELEMENT_PREFERENCES_KEY_PREFIX = "VGhpcyBpcyB0aGUgcHJlZml4IGZvciBhIHNlY3VyZSBzdG9yYWdlCg";
    private static final String SHARED_PREFERENCES_NAME = "SecureStorage";

    public Keystore(ReactApplicationContext context)  {
        super(context);

        preferences = context.getSharedPreferences(SHARED_PREFERENCES_NAME, Context.MODE_PRIVATE);
        charset = Charset.forName("UTF-8");

        StorageCipher18Implementation.moveSecretFromPreferencesIfNeeded(preferences, context);
        try {
            storageCipher = new StorageCipher18Implementation(context);
        } catch(Exception e) {
            //fail
        }
    }

    @Override
    public String getName() {
        return "Keystore";
    }

    @ReactMethod
    public void write(String key, String value) {
        try {
            byte[] result = storageCipher.encrypt(value.getBytes(charset));
            SharedPreferences.Editor editor = preferences.edit();

            editor.putString(addPrefixToKey(key), Base64.encodeToString(result, 0));
            editor.commit();
        }catch(Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void read(String key, Promise promise) {
        try {
            String encoded = preferences.getString(addPrefixToKey(key), null);
            String decoded = decodeRawValue(encoded);
            promise.resolve(decoded);
        }catch(Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void remove(String key) {
        SharedPreferences.Editor editor = preferences.edit();

        editor.remove(addPrefixToKey(key));
        editor.commit();
    }

    private String addPrefixToKey(String key) {
        return ELEMENT_PREFERENCES_KEY_PREFIX + "_" + key;
    }

    private String decodeRawValue(String value) throws Exception {
        if (value == null) {
            return null;
        }
        byte[] data = Base64.decode(value, 0);
        byte[] result = storageCipher.decrypt(data);

        return new String(result, charset);
    }
}
