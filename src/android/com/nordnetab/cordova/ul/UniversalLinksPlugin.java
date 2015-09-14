package com.nordnetab.cordova.ul;

import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import com.nordnetab.cordova.ul.js.JSAction;
import com.nordnetab.cordova.ul.model.JSMessage;
import com.nordnetab.cordova.ul.model.ULHost;
import com.nordnetab.cordova.ul.parser.ULConfigXmlParser;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONException;

import java.util.List;

/**
 * Created by Nikolay Demyankov on 09.09.15.
 */
public class UniversalLinksPlugin extends CordovaPlugin {

    private List<ULHost> supportedHosts;
    private CallbackContext defaultCallback;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        supportedHosts = new ULConfigXmlParser(cordova.getActivity()).parse();
    }

    @Override
    public void onStart() {
        super.onStart();
    }

    @Override
    public boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        boolean isHandled = true;
        if (JSAction.INIT.equals(action)) {
            setDefaultCallback(callbackContext);
        } else {
            isHandled = false;
        }

        return isHandled;
    }

    private void setDefaultCallback(CallbackContext callback) {
        this.defaultCallback = callback;

        handleLaunchIntent();
    }

    private void sendEventToJs(ULHost host, Uri correspondingUri) {
        if (defaultCallback == null) {
            return;
        }

        PluginResult result = new PluginResult(PluginResult.Status.OK, new JSMessage(host, correspondingUri));
        result.setKeepCallback(true);

        defaultCallback.sendPluginResult(result);
    }

    private void handleLaunchIntent() {
        if (supportedHosts == null || supportedHosts.size() == 0) {
            return;
        }

        // read intent
        Intent intent = cordova.getActivity().getIntent();
        String action = intent.getAction();
        Uri launchUri = intent.getData();

        // if app was not launched by the url - ignore
        if (!Intent.ACTION_VIEW.equals(action) || launchUri == null) {
            return;
        }

        // process url
        processURL(launchUri);
    }

    private void processURL(Uri launchUri) {
        ULHost host = findHostByUrl(launchUri);
        if (host == null) {
            Log.d("CUL", "Host " + launchUri.getHost() + " is not supported");
            return;
        }

        sendEventToJs(host, launchUri);
    }

    private ULHost findHostByUrl(Uri url) {
        ULHost host = null;
        for (ULHost supportedHost : supportedHosts) {
            if (supportedHost.getName().equals(url.getHost())) {
                host = supportedHost;
                break;
            }
        }

        return host;
    }
}