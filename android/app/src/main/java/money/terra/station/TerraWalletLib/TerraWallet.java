package money.terra.station.TerraWalletLib;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import org.json.JSONObject;

import money.terra.terrawallet.TerraWalletSDK;


public class TerraWallet extends ReactContextBaseJavaModule {
    /*
    gradle 추가
    implementation 'org.web3j:crypto:4.5.17'
    implementation 'com.google.code.gson:gson'
    * */

    public TerraWallet(ReactApplicationContext context)  {
        super(context);
    }


    @Override
    public String getName() {
        return "TerraWallet";
    }

    @ReactMethod
    public static void getNewWallet(Promise promise) {
        try {
            String[] wallet = TerraWalletSDK.getNewWallet();
            JSONObject result = new JSONObject();
            result.put("privateKey", wallet[0]);
            result.put("publicKey", wallet[1]);
            result.put("publicKey64", wallet[2]);
            result.put("address", wallet[3]);
            result.put("mnemonic", wallet[4]);
            promise.resolve(TerraWalletUtils.convertJsonToMap(result));
        }catch(Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public static void getNewWalletFromSeed(String mnemonic, int bip, Promise promise) {
        try {
            JSONObject result = getNewWalletFromSeed(mnemonic, bip);
            promise.resolve(TerraWalletUtils.convertJsonToMap(result));
        }catch(Exception e) {
            promise.reject(e);
        }
    }

    private static JSONObject getNewWalletFromSeed(String mnemonic, int bip) throws Exception{
        String[] wallet = TerraWalletSDK.getNewWalletFromSeed(mnemonic, bip);
        JSONObject result = new JSONObject();
        result.put("privateKey", wallet[0]);
        result.put("publicKey", wallet[1]);
        result.put("publicKey64", wallet[2]);
        result.put("address", wallet[3]);
        result.put("mnemonic", wallet[4]);
        return result;
    }

    @ReactMethod
    public static void sign(ReadableMap message,
                            String sequence,
                            String account_number,
                            String chain_id,
                            String hexPrivateKey,
                            String hexPublicKey,
                            Promise promise) {
        try {
            JSONObject msg = new JSONObject(message.toHashMap());
            JSONObject result = TerraWalletSDK.sign(msg, sequence, account_number, chain_id, hexPrivateKey, hexPublicKey);

            promise.resolve(TerraWalletUtils.convertJsonToMap(result));
        }catch(Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public static void isValidAddress(String address, Promise promise) {
        promise.resolve(TerraWalletSDK.isValidAddress(address));
    }
}
