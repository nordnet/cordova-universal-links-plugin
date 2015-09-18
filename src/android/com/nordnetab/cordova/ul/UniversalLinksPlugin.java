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
 * <p/>
 * Plugin main class.
 * Communicates with the JS side, handles launch intents and so on.
 */
public class UniversalLinksPlugin extends CordovaPlugin {

    // list of hosts, defined in config.xml
    private List<ULHost> supportedHosts;

    // callback through which we will send events to JS
    private CallbackContext defaultCallback;

    // region Public API

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        supportedHosts = new ULConfigXmlParser(cordova.getActivity()).parse();
    }

    @Override
    public boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        boolean isHandled = true;
        if (JSAction.INIT.equals(action)) {
            initJS(callbackContext);
        } else {
            isHandled = false;
        }

        return isHandled;
    }

    // endregion

    // region JavaScript methods

    /**
     * Initialize plugin to communicate with JavaScript side.
     *
     * @param callback default JS callback
     */
    private void initJS(CallbackContext callback) {
        setDefaultCallback(callback);
        handleLaunchIntent();
    }

    private void setDefaultCallback(CallbackContext callback) {
        this.defaultCallback = callback;
    }

    /**
     * Send event to JS side.
     *
     * @param host             host entry which corresponds to the launch link
     * @param correspondingUri link from which our app has been started
     */
    private void sendEventToJs(ULHost host, Uri correspondingUri) {
        if (defaultCallback == null) {
            return;
        }

        final JSMessage message = new JSMessage(host, correspondingUri);
        final PluginResult result = new PluginResult(PluginResult.Status.OK, message);
        result.setKeepCallback(true);

        defaultCallback.sendPluginResult(result);
    }

    // endregion

    // region Intent handling

    /**
     * Read data from the launch intent.
     * If we started the app from the link - try to process that.
     */
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

    /**
     * Handle launch url.
     * We will try to match it to the ones that were defined in config.xml.
     * If matched - event will be send to JS.
     *
     * @param launchUri url that started the app
     */
    private void processURL(Uri launchUri) {
        ULHost host = findHostByUrl(launchUri);
        if (host == null) {
            Log.d("CUL", "Host " + launchUri.getHost() + " is not supported");
            return;
        }

        sendEventToJs(host, launchUri);
    }

    /**
     * Find host entry that matches the launch url.
     *
     * @param url launch url
     * @return host entry; <code>null</code> - if none were found
     */
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

    // endregion
}