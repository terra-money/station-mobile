package money.terra.station.UtilLib

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.scottyab.rootbeer.RootBeer
import io.michaelrocks.paranoid.Obfuscate

@Obfuscate
class RootChecker(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
    private val context: Context? = reactContext

    override fun getName() = "RootChecker"

    @ReactMethod
    fun isDeviceRooted(promise: Promise) {
        try {
            RootBeer(context).let {
                if (it.isRootedWithBusyBoxCheck) {
                    promise.resolve(true)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
            promise.reject(e)
        }
        promise.resolve(false)
    }
}
