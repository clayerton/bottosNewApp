package fun.module.TuiaSDK;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Created by zzl on 2018/11/19.
 */

public class AdViewManager extends SimpleViewManager<AdView> {

    public static final String REACT_CLASS = "AdView";
    public static final String PROP_DATA = "dataDic";
    public static final String PROP_CLICK = "onClickView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected AdView createViewInstance(ThemedReactContext context) {
        return new AdView(context);
    }

    @ReactProp(name=PROP_DATA)
    public void setDataDic(AdView gradientView, ReadableMap dataDic) {

        gradientView.setDataDic(dataDic);
    }
}
