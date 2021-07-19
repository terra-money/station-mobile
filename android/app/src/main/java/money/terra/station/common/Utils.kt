package money.terra.station.common

import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.util.Base64
import android.webkit.CookieManager
import android.webkit.CookieSyncManager
import io.michaelrocks.paranoid.Obfuscate
import java.security.MessageDigest

@Obfuscate
object Utils {
    fun hexToBase64(hex: String): String {
        hex.chunked(2).map {
            it.toInt(16).toByte()
        }.toByteArray().let {
            return String(Base64.encode(it, Base64.NO_WRAP))
        }
    }

    @Suppress("DEPRECATION")
    @SuppressLint("PackageManagerGetSignatures")
    fun getCertificateFingerprints(context: Context): String {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                context.packageManager.getPackageInfo(
                        context.packageName,
                        PackageManager.GET_SIGNING_CERTIFICATES
                )?.let {
                    val messageDigest = MessageDigest.getInstance("SHA")
                    for (signature in it.signingInfo.apkContentsSigners) {
                        messageDigest.update(signature.toByteArray())
                    }
                    return String(Base64.encode(messageDigest.digest(), Base64.NO_WRAP))
                }
            } else {
                context.packageManager.getPackageInfo(
                        context.packageName,
                        PackageManager.GET_SIGNATURES
                )?.let {
                    val messageDigest = MessageDigest.getInstance("SHA")
                    for (signature in it.signatures) {
                        messageDigest.update(signature.toByteArray())
                    }
                    return String(Base64.encode(messageDigest.digest(), Base64.NO_WRAP))
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return ""
    }

    @Suppress("DEPRECATION")
    @SuppressLint("ObsoleteSdkInt")
    fun clearCookies(context: Context) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                CookieManager.getInstance().removeAllCookies(null)
                CookieManager.getInstance().flush()
            } else {
                val cookieSyncManager = CookieSyncManager.createInstance(context)
                cookieSyncManager.startSync()
                val cookieManager = CookieManager.getInstance()
                cookieManager.removeAllCookie()
                cookieManager.removeSessionCookie()
                cookieSyncManager.stopSync()
                cookieSyncManager.sync()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}