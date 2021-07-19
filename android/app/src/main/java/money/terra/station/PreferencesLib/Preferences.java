package money.terra.station.PreferencesLib;

import android.content.Context;
import android.content.SharedPreferences;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Set;

import io.michaelrocks.paranoid.Obfuscate;

@Obfuscate
public class Preferences extends ReactContextBaseJavaModule {
    private final SharedPreferences preferences;
    private static final String SHARED_PREFERENCES_NAME = "SharedPreferences";
    private static final String DOUBLE_PREFIX = "VGhpcyBpcyB0aGUgcHJlZml4IGZvciBEb3VibGUu";

    public Preferences(ReactApplicationContext context)  {
        super(context);

        preferences = context.getSharedPreferences(SHARED_PREFERENCES_NAME, Context.MODE_PRIVATE);
    }

    @Override
    public String getName() {
        return "Preferences";
    }

    @ReactMethod
    public void setBool(String key, Boolean value) {
        preferences.edit().putBoolean(key, value).apply();
    }

    @ReactMethod
    public void getBool(String key, Promise promise) {
        promise.resolve(preferences.getBoolean(key, false));
    }

    @ReactMethod
    public void setDouble(String key, double value) {
        String doubleValueStr = Double.toString(value);
        preferences.edit().putString(key, DOUBLE_PREFIX + doubleValueStr).apply();
    }

    @ReactMethod
    public void getDouble(String key, Promise promise) {
        String value = preferences.getString(key, "0.0");
        value = value.replace(DOUBLE_PREFIX, "");
        try {
            promise.resolve(Double.parseDouble(value));
        }catch(NumberFormatException e) {
            promise.resolve(0.0);
        }
    }

    @ReactMethod
    public void setInt(String key, int value) {
        //1.0에서 int를 long으로 처리하고 있음.
        preferences.edit().putLong(key, value).apply();
    }

    @ReactMethod
    public void getInt(String key, Promise promise) {
        try {
            int value = (int) preferences.getLong(key, 0L);
            promise.resolve(value);
        }catch(Exception e) {
            promise.resolve(0);
        }
    }

    @ReactMethod
    public void setString(String key, String value) {
        if (value == null) {
            return;
        }
        preferences.edit().putString(key, value).apply();
    }

    @ReactMethod
    public void getString(String key, Promise promise) {
        promise.resolve(preferences.getString(key, ""));
    }

    @ReactMethod
    public void remove(String key) {
        preferences.edit().remove(key).apply();
    }

    @ReactMethod
    public void clear() {
        Set<String> keySet = preferences.getAll().keySet();
        SharedPreferences.Editor clearEditor = preferences.edit();
        for (String keyToDelete : keySet) {
            clearEditor.remove(keyToDelete);
        }
        clearEditor.apply();
    }
}
