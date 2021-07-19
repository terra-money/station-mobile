package money.terra.station.UtilLib

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.framgia.android.emulator.EmulatorDetector
import io.michaelrocks.paranoid.Obfuscate
import money.terra.station.BuildConfig

@Obfuscate
class EmulatorChecker(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "EmulatorChecker"

    @ReactMethod
    fun isEmulator(promise: Promise) {
        try {
            EmulatorDetector.with(reactApplicationContext).let {
                it.isDebug = BuildConfig.DEBUG
                it.detect { ret ->
                    promise.resolve(ret)
                }
            }
        } catch (e: Exception) {
            promise.reject(e)
        }
    }
}