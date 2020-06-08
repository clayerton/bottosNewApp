package fun.module.RadarChart;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import java.util.ArrayList;
import java.util.List;

public class RadarChartManager extends SimpleViewManager<RadarView> {

    public static final String REACT_CLASS = "RadarChart";
    public static final String PROP_DATA = "dataArray";
    public static final String PROP_CLICK = "onClickView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected RadarView createViewInstance(ThemedReactContext context) {
        return new RadarView(context);
    }

    @ReactProp(name=PROP_DATA)
    public void setDataArray(RadarView gradientView, ReadableArray dataArray) {

        List<RadarData> dataList = new ArrayList<>();
        for (int i = 0; i < dataArray.size(); i++) {
            ReadableMap map = dataArray.getMap(i);
            String name = map.getString("name");
            double value = Double.valueOf(map.getString("value")) / 100.0;

            RadarData data = new RadarData(name,value);
            dataList.add(data);
        }
        gradientView.setDataList(dataList);
    }
//    @ReactProp(name=PROP_CLICK)
//    public void setColors(RadarChartView gradientView, ReadableArray dataArray) {
////        gradientView.setColors(dataArray);
//    }
}
