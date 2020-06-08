package fun.module;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import fun.module.rsa.RSAModule;
import fun.module.update.ClientUpdateModule;
import fun.umeng.share.ShareModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by zzl on 2018/10/19.
 */

public class ManagePackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new ClientUpdateModule(reactContext));
        modules.add(new ShareModule(reactContext));
        modules.add(new RSAModule(reactContext));
        return modules;
    }
}
