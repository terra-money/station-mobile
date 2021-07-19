package money.terra.station.UtilLib

import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class PushNotificationManager(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
    private var context: Context? = reactContext

    override fun getName() = "PushNotificationManager"

    @ReactMethod
    fun clearNotification(promise: Promise) {
        context?.let {
            (it.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager).cancelAll()
        }

        return promise.resolve(true)
    }

    @ReactMethod
    fun moveNotificationSettings(promise: Promise) {
        context?.let {
            val intent = Intent()
            when {
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.O -> {
                    intent.action = android.provider.Settings.ACTION_APP_NOTIFICATION_SETTINGS
                    intent.putExtra(android.provider.Settings.EXTRA_APP_PACKAGE, context?.packageName)
                }

                Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP -> {
                    intent.action = "android.settings.APP_NOTIFICATION_SETTINGS"
                    intent.putExtra("app_package", context?.packageName)
                    intent.putExtra("app_uid", context?.applicationInfo?.uid)
                }

                else -> {
                    intent.action = android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS
                    intent.addCategory(Intent.CATEGORY_DEFAULT)
                    intent.data = Uri.parse("package:" + context?.packageName)
                }
            }
            context?.startActivity(intent)
        }

        return promise.resolve(true)
    }
}