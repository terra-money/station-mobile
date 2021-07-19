package money.terra.station.UtilLib

import android.content.Context
import android.content.pm.ApplicationInfo
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import io.michaelrocks.paranoid.Obfuscate
import money.terra.station.common.Utils.getCertificateFingerprints
import money.terra.station.common.Utils.hexToBase64

@Obfuscate
class TamperChecker(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
    private var context: Context? = reactContext

    override fun getName() = "TamperChecker"

    @ReactMethod
    fun debugCheck(promise: Promise) {
        val debugFlagEnabled = (context?.applicationInfo?.flags?.and(ApplicationInfo.FLAG_DEBUGGABLE)) != 0
        val debugConnected = android.os.Debug.isDebuggerConnected()

        promise.resolve(debugFlagEnabled or debugConnected)
    }

    @ReactMethod
    fun fingerprintCheck(promise: Promise) {
        try {
            context?.let {
                val f = arrayOf( // fingerprints
                        "1CB29467831EAB042F8B60497BAA749C51DBE339", // Upload
                        "7C574BE46C2A0F0FFC00515E971C19D87E5D3DD4", // Sign
                        "633C879C5D4E96E33F572C2DCA641F1114DE0A07", // Firebase
                )

                for (i in f) {
                    if (hexToBase64(i) == getCertificateFingerprints(it)) {
                        promise.resolve(true)
                        return
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
            promise.reject(e)
        }
        promise.resolve(false)
    }
}