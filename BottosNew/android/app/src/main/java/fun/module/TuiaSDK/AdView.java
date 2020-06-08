package fun.module.TuiaSDK;

import android.content.Context;
import android.graphics.Canvas;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import com.check.ox.sdk.OxListener;
import com.check.ox.sdk.OxStreamerView;
import com.check.ox.sdk.OxTbScreenOx;
import com.facebook.react.bridge.ReadableMap;
import android.widget.LinearLayout;

/**
 * Created by zzl on 2018/11/19.
 */

public class AdView  extends ViewGroup {

    private final Context context;

    public AdView(Context context) {
        this(context, null);
    }

    public AdView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public AdView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        this.context = context;
        removeAllViews();

        this.setFocusable(false);
        this.setClickable(false);

        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        this.setLayoutParams(params);
    }


    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
        //l,t当前视图左上角距离父视图左上角的数值，r，b当前视图右下角距离父视图左上角的数值
        int childCount = getChildCount();
        Log.i("tag", "l: "+l+"  "+"t: "+t+"  "+"r: "+r+"  "+"b: "+b);
        int top = 0;
        for (int i = 0; i < childCount; i++) {
            View view = getChildAt(i);
            view.layout(0,0,r - l,b - t);
        }
    }
    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        final int count = getChildCount();

        for (int i = 0; i < count; i++) {
            //这个很重要，没有就不显示
            getChildAt(i).measure(widthMeasureSpec, heightMeasureSpec);
        }
    }

    @Override
    protected void onDraw(Canvas canvas) {

//        canvas.drawARGB(255, 255, 0,0);

    }

    public void setDataDic(ReadableMap dataDic) {
//        Log.i("AdView","+++++++1+++++++++++"+dataDic);
//        Log.i("AdView","+++++++++2+++++++++"+dataDic.getString("index"));
//        Log.i("AdView","++++++++3++++++++++"+Integer.valueOf(dataDic.getString("index")));

        //index:0 启动页广告 id：254969
        //index:1 弹窗广告 id：254951
        //index:2 banner广告 id：254972

        switch (Integer.valueOf(dataDic.getString("index"))) {
            case 0:
            {

            }
            break;
            case 1:
            {
                OxTbScreenOx mTMItAd = new OxTbScreenOx(context);
                mTMItAd.loadAd(Integer.valueOf(dataDic.getString("id")));
            }
            break;
            case 2:
            {
                OxStreamerView adView = new OxStreamerView(context,null);

                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
                adView.setLayoutParams(params);

                this.addView(adView);
                adView.loadAd(Integer.valueOf(dataDic.getString("id")));//加载对应GGid
            }
            break;

            default:
                break;
        }

//        new Handler().postDelayed(new Runnable(){
//            public void run() {
//            }
//        }, 1000);

    }
}
