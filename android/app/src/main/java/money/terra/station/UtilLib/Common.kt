package money.terra.station.UtilLib

import android.annotation.SuppressLint
import android.content.Context
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import io.michaelrocks.paranoid.Obfuscate
import java.io.UnsupportedEncodingException
import java.util.*

@Obfuscate
class Common(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
    private val context = reactContext
    private val preferences = context?.getSharedPreferences("Common", Context.MODE_PRIVATE)
    private val uuidKey = "uuid"

    override fun getName() = "Common"

    private fun getAppUuid(): String? =
        preferences?.getString(uuidKey, null)

    private fun setAppUuid(newUuid: String) =
        preferences?.edit()?.putString(uuidKey, newUuid)?.apply()

    @SuppressLint("HardwareIds", "DefaultLocale")
    fun makeAppUuid(): String {
        val androidId = Settings.Secure.getString(context?.contentResolver, Settings.Secure.ANDROID_ID)
        val uuid = if (androidId.isNullOrEmpty() || androidId.equals("9774d56d682e549c")) {
            UUID.randomUUID()
        } else {
            try {
                UUID.nameUUIDFromBytes(androidId.toByteArray())
            } catch (e: UnsupportedEncodingException) {
                UUID.randomUUID()
            }
        }

        return uuid.toString().toUpperCase()
    }

    @ReactMethod
    fun getAppIdentifier(promise: Promise) {
        try {
            val uuid = getAppUuid()
            return if (uuid.isNullOrEmpty()) {
                val newUuid = makeAppUuid()
                setAppUuid(newUuid)
                promise.resolve(newUuid)
            } else {
                promise.resolve(uuid)
            }
        } catch (e: Exception) {
            e.printStackTrace()
            promise.reject(e)
        }
    }
}