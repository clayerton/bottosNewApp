package fun.wali.community;

/**
 * Created by zzl on 2018/11/21.
 */

import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.util.Log;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.LinearLayout;

import com.check.ox.sdk.OxListener;
import com.check.ox.sdk.OxSDK;
import com.check.ox.sdk.OxShListener;
import com.check.ox.sdk.OxShView;
import com.check.ox.sdk.OxStreamerView;
import com.check.ox.sdk.OxShListener;
import com.check.ox.sdk.OxShView;

import fun.wali.community.R;

public class TestActivity extends Activity{
    OxStreamerView mTMBrAdView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // 1
        super.onCreate(savedInstanceState);

        setContentView(R.layout.test_layout);
        OxSDK.init(this);


        mTMBrAdView = (OxStreamerView) findViewById(R.id.TMBrView);
        mTMBrAdView.setAdListener(new OxListener() {
            @Override
            public void onReceiveAd() {
                Log.d("========", "onReceiveAd");
            }

            @Override
            public void onFailedToReceiveAd() {
                Log.d("========", "onFailedToReceiveAd");
            }

            @Override
            public void onLoadFailed() {
                Log.d("========", "onLoadFailed");
            }

            @Override
            public void onCloseClick() {
                Log.d("========", "onCloseClick");
            }

            @Override
            public void onAdClick() {
                Log.d("========", "onAdClick");
            }

            @Override
            public void onAdExposure() {
                Log.d("========", "onExposure");
            }
        });

//        mTMBrAdView.loadAd(154);
        mTMBrAdView.loadAd(255677);
    }
}
