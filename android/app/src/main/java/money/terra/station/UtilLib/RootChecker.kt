package money.terra.station.UtilLib

import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.BufferedReader
import java.io.File
import java.io.IOException
import java.io.InputStreamReader
import java.util.*

class RootChecker(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
    private var context: Context? = reactContext

    override fun getName() = "RootChecker"

    @ReactMethod
    fun isDeviceRooted(promise: Promise) {
        val ret1 = detectRootManagementApps()
        if (ret1) Log.e("RootChecker", "Root detected! detectRootManagementApps()")
        val ret2 = detectPotentiallyDangerousApps()
        if (ret2) Log.e("RootChecker", "Root detected! detectPotentiallyDangerousApps()")
        val ret3 = checkForSuBinary()
        if (ret3) Log.e("RootChecker", "Root detected! checkForSuBinary()")
        val ret4 = checkForBusyBoxBinary()
        if (ret4) Log.e("RootChecker", "Root detected! checkForBusyBoxBinary()")
        val ret5 = checkForDangerousProps()
        if (ret5) Log.e("RootChecker", "Root detected! checkForDangerousProps()")
        val ret6 = checkForRwPaths()
        if (ret6) Log.e("RootChecker", "Root detected! checkForRWPaths()")
        val ret7 = detectTestKeys()
        if (ret7) Log.e("RootChecker", "Root detected! detectTestKeys()")
        val ret8 = checkSuExists()
        if (ret8) Log.e("RootChecker", "Root detected! checkSuExists()")

        promise.resolve(ret1 || ret2 || ret3 || ret4 || ret5 || ret6 || ret7 || ret8)
    }

    /**
     * Test Key Check
     */
    private fun detectTestKeys(): Boolean {
        val buildTags = Build.TAGS ?: return false
        val buildFinger = Build.FINGERPRINT
        val product = Build.PRODUCT
        val hardware = Build.HARDWARE
        val display = Build.DISPLAY
        return (buildTags.contains("test-keys") or
                buildFinger.contains("genric.*test-keys") or
                product.contains("generic") or
                product.contains("sdk") or
                hardware.contains("goldfish") or
                display.contains(".*test-keys"))
    }

    /**
     * Installed App Check
     */
    private fun isAnyPackageFromListInstalled(packages: List<String>): Boolean {
        val pm = context?.packageManager ?: return false

        for (packageName in packages) {
            try {
                pm.getPackageInfo(packageName, 0)
                return true
            } catch (e: PackageManager.NameNotFoundException) {
                // do nothing
            }
        }
        return false
    }

    private fun detectApps(packages: Array<String>, additionalApps: Array<String>? = null) : Boolean {
        val p = ArrayList<String>()
        p.addAll(packages)

        if (additionalApps.isNullOrEmpty().not())
            p.addAll(additionalApps!!)

        return isAnyPackageFromListInstalled(p)
    }

    private fun detectRootManagementApps(additionalRootManagementApps: Array<String>? = null)
            = detectApps(Constants.knownRootAppsPackages, additionalRootManagementApps)

    private fun detectPotentiallyDangerousApps(additionalDangerousApps: Array<String>? = null)
            = detectApps(Constants.knownDangerousAppsPackages, additionalDangerousApps)

    private fun detectRootCloakingApps(additionalRootCloakingApps: Array<String>? = null)
            = detectApps(Constants.knownRootCloakingPackages, additionalRootCloakingApps)

    /**
     * Binary check
     */
    private fun checkForBinary(filename: String): Boolean {
        val pathsArray = Constants.suPaths

        for (path in pathsArray) {
            val completePath = path + filename
            return File(completePath).exists()
        }
        return false
    }

    private fun checkForSuBinary() = checkForBinary("su")
    private fun checkForBusyBoxBinary() = checkForBinary("busybox")

    /**
     * Execute check
     */
    private fun runtimeExec(command: String): Array<String>? {
        try {
            val inputStream = Runtime.getRuntime()
                    .exec(command)
                    .inputStream ?: return null

            return Scanner(inputStream)
                    .useDelimiter("\\A")
                    .next()
                    .split("\n")
                    .toTypedArray()
        } catch (e: IOException) {
            e.printStackTrace()
        } catch (e: NoSuchElementException) {
            // do nothing
        }
        return null
    }

    private fun propsReader(): Array<String>? = runtimeExec("getprop")

    private fun mountReader(): Array<String>? = runtimeExec("mount")

    private fun checkForDangerousProps(): Boolean {
        val lines = propsReader() ?: return false

        val dangerousProps: MutableMap<String, String> = HashMap()
        dangerousProps["ro.debuggable"] = "1"
        dangerousProps["ro.secure"] = "0"

        for (line in lines) {
            for (key in dangerousProps.keys) {
                if (line.contains(key)) {
                    val badValue = dangerousProps[key]
                    if (line.contains("[$badValue]")) {
                        return true
                    }
                }
            }
        }
        return false
    }

    private fun checkForRwPaths(): Boolean {
        val lines = mountReader() ?: return false

        for (line in lines) {
            val args = line.split(" ").toTypedArray()
            if (args.size < 4)
                continue

            val mountPoint = args[1]
            val mountOptions = args[3]
            for (pathToCheck in Constants.pathsThatShouldNotBeWritable) {
                if (mountPoint.equals(pathToCheck, ignoreCase = true)) {
                    for (option in mountOptions.split(",").toTypedArray()) {
                        if (option.equals("rw", ignoreCase = true)) {
                            return true
                        }
                    }
                }
            }
        }
        return false
    }

    /**
     * find su binary
     */
    private fun checkSuExists(): Boolean {
        var process: Process? = null
        return try {
            process = Runtime.getRuntime().exec(arrayOf("which", "su"))
            val buffer =
                    BufferedReader(InputStreamReader(process.inputStream))
            buffer.readLine() != null
        } catch (t: Throwable) {
            false
        } finally {
            try {
                process?.exitValue()
            }
            catch (e: IllegalThreadStateException) {
                process?.destroy()
            }
        }
    }

    /**
     * CONSTANT VALUES
     */
    private object Constants {
        val knownRootAppsPackages = arrayOf(
                "com.noshufou.android.su",
                "com.noshufou.android.su.elite",
                "eu.chainfire.supersu",
                "com.koushikdutta.superuser",
                "com.thirdparty.superuser",
                "com.yellowes.su",
                "com.zachspong.temprootremovejb",
                "com.ramdroid.appquarantine",
                "eu.chainfire.supersu",
                "com.geohot.towelroot"
        )
        val knownDangerousAppsPackages = arrayOf(
                "com.koushikdutta.rommanager",
                "com.koushikdutta.rommanager.license",
                "com.dimonvideo.luckypatcher",
                "com.chelpus.lackypatch",
                "com.ramdroid.appquarantine",
                "com.ramdroid.appquarantinepro"
        )
        val knownRootCloakingPackages = arrayOf(
                "com.devadvance.rootcloak",
                "com.devadvance.rootcloak2",
                "com.devadvance.rootcloakplus",
                "de.robv.android.xposed.installer",
                "com.saurik.substrate",
                "com.zachspong.temprootremovejb",
                "com.amphoras.hidemyroot",
                "com.amphoras.hidemyrootadfree",
                "com.formyhm.hiderootPremium",
                "com.formyhm.hideroot"
        )
        val suPaths = arrayOf(
                "/data/local/",
                "/data/local/bin/",
                "/data/local/xbin/",
                "/sbin/",
                "/su/bin/",
                "/system/bin/",
                "/system/bin/.ext/",
                "/system/bin/failsafe/",
                "/system/sd/xbin/",
                "/system/usr/we-need-root/",
                "/system/xbin/"
        )
        val pathsThatShouldNotBeWritable = arrayOf(
                "/system",
                "/system/bin",
                "/system/sbin",
                "/system/xbin",
                "/vendor/bin",  //"/sys",
                "/sbin",
                "/etc"
        )
    }
}
