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

    private JSMessage storedMessage;

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

    @Override
    public void onNewIntent(Intent intent) {
        handleIntent(intent);
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
        if (storedMessage != null) {
            sendMessageToJs(storedMessage);
            storedMessage = null;
            return;
        }

        handleIntent(cordova.getActivity().getIntent());
    }

    private void setDefaultCallback(CallbackContext callback) {
        this.defaultCallback = callback;
    }

    /**
     * Send message to JS side.
     *
     * @param message message to send
     * @return true - if message is sent; otherwise - false
     */
    private boolean sendMessageToJs(JSMessage message) {
        if (defaultCallback == null) {
            return false;
        }

        final PluginResult result = new PluginResult(PluginResult.Status.OK, message);
        result.setKeepCallback(true);
        defaultCallback.sendPluginResult(result);

        return true;
    }

    // endregion

    // region Intent handling

    /**
     * Handle launch intent.
     * If it is an UL intent - then event will be dispatched to the JS side.
     *
     * @param intent launch intent
     */
    private void handleIntent(Intent intent) {
        if (intent == null || supportedHosts == null || supportedHosts.size() == 0) {
            return;
        }

        // read intent
        String action = intent.getAction();
        Uri launchUri = intent.getData();

        // if app was not launched by the url - ignore
        if (!Intent.ACTION_VIEW.equals(action) || launchUri == null) {
            return;
        }

        // try to find host in the hosts list from the config.xml
        ULHost host = findHostByUrl(launchUri);
        if (host == null) {
            Log.d("CUL", "Host " + launchUri.getHost() + " is not supported");
            return;
        }

        // send message to the JS side;
        // if callback is not yet initialized - store message for later use;
        final JSMessage message = new JSMessage(host, launchUri);
        if (!sendMessageToJs(message)) {
            storedMessage = message;
        } else {
            storedMessage = null;
        }
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