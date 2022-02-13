package com.rnroomfinder;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;

import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.lang.String;
import java.lang.Boolean;
import java.util.List;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiManager;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.WritableNativeMap;

public class IndoorPositioning extends ReactContextBaseJavaModule {
    private ReactApplicationContext mReactContext;
    private final String TAG = "IndoorPositioning";
    private WifiManager wifi;
    private Promise getScanDataPromise;

    public IndoorPositioning(ReactApplicationContext reactContext) {
        super(reactContext);

        mReactContext = reactContext;
        wifi = (WifiManager) mReactContext.getApplicationContext().getSystemService(Context.WIFI_SERVICE);

        //Crash if WifiManager is null
        assert wifi != null;

        //Enable wifi if not enabled
        if (!wifi.isWifiEnabled()) {
            wifi.setWifiEnabled(true);
        }

        // Register wifi intent filter
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION);
        mReactContext.getApplicationContext().registerReceiver(mWifiScanReceiver, intentFilter);
    }

    @NotNull
    @Override
    public String getName() {
        return "IndoorPositioning";
    }

    @ReactMethod
    public void getScanData(Promise promise) {
        if(getScanDataPromise != null) {
            promise.reject(new Exception("Scan already in progress, cannot initiate another scan"));
            return;
        }

        getScanDataPromise = promise;
        wifi.startScan();
    }

    private final BroadcastReceiver mWifiScanReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context c, Intent intent) {
            WritableNativeMap wifiResults = new WritableNativeMap();

            List<ScanResult> wifiScanList = wifi.getScanResults();
            for (int i = 0; i < wifiScanList.size(); i++) {
                String name = wifiScanList.get(i).BSSID.toLowerCase();
                int rssi = wifiScanList.get(i).level;
                Log.v(TAG, "wifi: " + name + " => " + rssi + "dBm");
                try {
                    wifiResults.putInt(name, rssi);
                } catch (Exception e) {
                    Log.e(TAG, e.toString());
                }
            }

            if(getScanDataPromise==null) {
                Toast.makeText(mReactContext.getApplicationContext(),"getScanDataPromise is null can't return results",Toast.LENGTH_SHORT).show();
                return;
            }

            final WritableNativeMap results = new WritableNativeMap();
            results.putMap("bluetooth",new WritableNativeMap());
            results.putMap("wifi",wifiResults);

            getScanDataPromise.resolve(results);
            getScanDataPromise = null;
        }
    };
}
