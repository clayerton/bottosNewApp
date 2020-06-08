package fun.module.update;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.kcode.lib.UpdateWrapper;
import com.kcode.lib.bean.VersionModel;
import com.kcode.lib.net.CheckUpdateTask;
import com.facebook.react.bridge.Callback;

import fun.wali.community.R;

/**
 * Created by zzl on 2018/5/29.
 */

public class ClientUpdateModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext context;
    private Callback callback;

    public ClientUpdateModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "ClientUpdateModule";
    }

    @ReactMethod
    private void checkUpdate(String url,int isShowToast,Callback alertCallback) {
        callback = alertCallback;

        UpdateWrapper updateWrapper = new UpdateWrapper.Builder(context)
                //set interval Time
                .setTime(0)
                //set notification icon
                .setNotificationIcon(R.drawable.ic_launcher)
                //set update file url
                .setUrl(url)
                //set showToast. default is true
                .setIsShowToast(isShowToast > 0 ? true:false)
                //add callback ,return new version info
                .setCallback(new CheckUpdateTask.Callback() {
                    @Override
                    public void callBack(VersionModel versionModel) {
                        PackageManager packageManager = context.getPackageManager();
                        String packageName = context.getPackageName();

                        try {
                            PackageInfo packageInfo = packageManager.getPackageInfo(packageName, 0);
                            PackageInfo info = packageManager.getPackageInfo(packageName, 0);
                            //需要更新
                            if (versionModel.getVersionCode() > info.versionCode){
                                //强制更新
                                if (versionModel.getMinSupport() > info.versionCode) {
                                    callback.invoke("0");
                                }else{//非强制更新
                                    callback.invoke("1");
                                }
                            }else {
                                callback.invoke("0");
                            }
                        } catch (PackageManager.NameNotFoundException e) {
                            e.printStackTrace();
                            callback.invoke("0");
                        }
                    }
                }).build();
        updateWrapper.start();
    }
}
