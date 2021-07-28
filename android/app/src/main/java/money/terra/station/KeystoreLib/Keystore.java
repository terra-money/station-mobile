package money.terra.station.KeystoreLib;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Base64;

import androidx.security.crypto.EncryptedSharedPreferences;
import androidx.security.crypto.MasterKeys;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.nio.charset.Charset;

import io.michaelrocks.paranoid.Obfuscate;

@Obfuscate
public class Keystore extends ReactContextBaseJavaModule {
    private final Context context;
    private SharedPreferences preferences;
    private final Charset charset = Charset.forName("UTF-8");;
    private StorageCipher storageCipher = null;
    private static final String ELEMENT_PREFERENCES_KEY_PREFIX = "VGhpcyBpcyB0aGUgcHJlZml4IGZvciBhIHNlY3VyZSBzdG9yYWdlCg";
    private static final String SHARED_PREFERENCES_NAME = "SecureStorage";

    public Keystore(ReactApplicationContext context) {
        super(context);
        this.context = context;

        try {
            preferences = EncryptedSharedPreferences.create(
                    SHARED_PREFERENCES_NAME,
                    MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC),
                    context,
                    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public String getName() {
        return "Keystore";
    }

    @ReactMethod
    public void migratePreferences(String key) {
        try {
            if(storageCipher == null) {
                StorageCipher18Implementation.moveSecretFromPreferencesIfNeeded(preferences, context);
                storageCipher = new StorageCipher18Implementation(context);
            }

            SharedPreferences oldPreferences =
                    context.getSharedPreferences(SHARED_PREFERENCES_NAME, Context.MODE_PRIVATE);

            String encoded = oldPreferences.getString(addPrefixToKey(key), null);
            String decoded = decodeRawValue(encoded);
            if (decoded != null) {
                write(key, decoded);
                oldPreferences.edit().remove(addPrefixToKey(key)).apply();
            }
        } catch(Exception ignored) {}
    }

    @ReactMethod
    public void write(String key, String value) {
        try {
            preferences.edit().putString(key, value).apply();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void read(String key, Promise promise) {
        try {
            String ret = preferences.getString(key, null);
            promise.resolve(ret);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void remove(String key) {
        try {
            preferences.edit().remove(key).apply();
        } catch (Exception ignored) {}
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
