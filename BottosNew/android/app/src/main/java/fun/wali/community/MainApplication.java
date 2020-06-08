package fun.wali.community;

import android.app.Application;
import android.content.Context;
import android.os.Handler;

import com.check.ox.sdk.OxSDK;
import com.facebook.react.ReactApplication;
import com.rnfs.RNFSPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.imagepicker.ImagePickerPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.umeng.socialize.PlatformConfig;
import com.zmxv.RNSound.RNSoundPackage;
import com.horcrux.svg.SvgPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.microsoft.codepush.react.CodePushBuilder;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import fun.umeng.analytics.RNUMConfigure;
import com.umeng.commonsdk.UMConfigure;
import fun.umeng.analytics.DplusReactPackage;
import fun.module.ManagePackage;
import java.util.Arrays;
import java.util.List;
import android.support.multidex.MultiDex;
import fun.module.RadarChart.RadarChartPackage;
import fun.module.TuiaSDK.AdViewPackage;

public class MainApplication extends Application implements ReactApplication {

  private Handler handler;
  public static final String UPDATE_STATUS_ACTION = "com.umeng.message.example.action.UPDATE_STATUS";
  private static final String TAG = MainApplication.class.getName();

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
            new RNFSPackage(),
              new LinearGradientPackage(),
              new ImagePickerPackage(),
              new RNViewShotPackage(),
              new RNI18nPackage(),
              new RNSoundPackage(),
              new SvgPackage(),
              new RNSpinkitPackage(),
              new RNDeviceInfo(),
              new CodePushBuilder(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext())
                      .setIsDebugMode(BuildConfig.DEBUG)
                      .setServerUrl(getResources().getString(R.string.reactNativeCodePush_androidServerURL))
                      .build(),
              new SplashScreenReactPackage(),
              new PickerPackage(),
              new DplusReactPackage(),
              new RadarChartPackage(),
              new AdViewPackage(),
              new ManagePackage()

      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  protected void attachBaseContext(Context base) {
    super.attachBaseContext(base);
    MultiDex.install(this);
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    OxSDK.init(this);

    //初始化组件化基础库, 统计SDK/推送SDK/分享SDK都必须调用此初始化接口
    RNUMConfigure.init(this, "5bc87852b465f5f3d70002ed", "Umeng", UMConfigure.DEVICE_TYPE_PHONE, "");
  }

  {

    PlatformConfig.setWeixin("wx45a525dacee46b3e", "1b9b4c6a3fddc50969753ddbb06e848a");

  }
}