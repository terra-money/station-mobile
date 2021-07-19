package money.terra.station.UtilLib

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager
import java.util.*

class EmulatorCheckerPackage : ReactPackage {
    override fun createViewManagers(reactContext: ReactApplicationContext)
            : MutableList<ViewManager<View, ReactShadowNode<*>>> = Collections.emptyList()

    override fun createNativeModules(reactContext: ReactApplicationContext)
            : MutableList<NativeModule> = mutableListOf(EmulatorChecker(reactContext))
}