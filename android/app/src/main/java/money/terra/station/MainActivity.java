package money.terra.station;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import org.devio.rn.splashscreen.SplashScreen;

import money.terra.station.UtilLib.PreventCapture;
import money.terra.station.common.Utils;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "TerraStation";
  }

  // Because RectButton onPress not working, added blow codes.
  // https://github.com/software-mansion/react-native-gesture-handler/issues/699
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    SplashScreen.show(this, R.style.SplashTheme);

    PreventCapture.Companion.setActivity(this);
    Utils.INSTANCE.clearCookies(this);
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
    Utils.INSTANCE.clearCookies(this);
  }
}
