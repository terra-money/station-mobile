package money.terra.station.UtilLib

import android.annotation.SuppressLint
import android.app.Activity
import android.view.WindowManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import io.michaelrocks.paranoid.Obfuscate

@Obfuscate
class PreventCapture(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "PreventCapture"

    companion object {
        @SuppressLint("StaticFieldLeak")
        private var activity: Activity? = null

        fun setActivity(activity: Activity) {
            this.activity = activity
        }
    }

    @ReactMethod
    fun setCaptureEnable(b: Boolean, promise: Promise) {
        val flag = WindowManager.LayoutParams.FLAG_SECURE
        try {
            activity?.let {
                if(b) {
                    it.window.clearFlags(flag)
                } else {
                    it.window.setFlags(flag, flag)
                }
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }
}