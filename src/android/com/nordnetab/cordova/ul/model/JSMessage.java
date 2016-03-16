package com.nordnetab.cordova.ul.model;

import android.net.Uri;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;
import java.util.Set;

/**
 * Created by Nikolay Demyankov on 10.09.15.
 * <p/>
 * Model for the message entry, that is send to JS.
 */
public class JSMessage extends JSONObject {

    // keys for the message base structure
    private static final class JSGeneralKeys {
        /**
         * Event name
         */
        public static final String EVENT = "event";

        /**
         * Message data block
         */
        public static final String DATA = "data";
    }

    // keys for the message data block
    private static final class JSDataKeys {

        /**
         * Path part of the url
         */
        public static final String PATH = "path";

        /**
         * Scheme of the url
         */
        public static final String SCHEME = "scheme";

        /**
         * Host of the url
         */
        public static final String HOST = "host";

        /**
         * Hash (fragment) from the url - data after '#'
         */
        public static final String HASH = "hash";

        /**
         * Query parameters - data after '?'
         */
        public static final String PARAMS = "params";

        /**
         * Launch url as it is
         */
        public static final String ORIGIN = "url";
    }

    private String eventName;

    /**
     * Constructor
     *
     * @param host        host entry that corresponds to the launching url
     * @param originalUri launch url
     */
    public JSMessage(ULHost host, Uri originalUri) {
        setEventName(host, originalUri);
        setMessageData(host, originalUri);
    }

    /**
     * Getter for event name of this message.
     *
     * @return event name
     */
    public String getEventName() {
        return eventName;
    }

    // region Event name setters

    /**
     * Set event name for this message entry.
     */
    private void setEventName(ULHost host, Uri originalUri) {
        eventName = getEventName(host, originalUri);

        try {
            put(JSGeneralKeys.EVENT, eventName);
        } catch (JSONException e) {
            Log.d("UniversalLinks", "Failed to set event name", e);
        }
    }

    /**
     * Find event name based on the launching url.
     * By default, event name from the host object will be used.
     * But if we have some path entry in the host and it matches the one from the launch url - his event name will be used.
     */
    private String getEventName(ULHost host, Uri originalUri) {
        String event = host.getEvent();
        final String originPath = originalUri.getPath().toLowerCase();
        final List<ULPath> hostPathsList = host.getPaths();
        for (ULPath hostPath : hostPathsList) {
            final String hostPathUrl = hostPath.getUrl();
            if (hostPathUrl == null) {
                continue;
            }

            if (originPath.matches(hostPathUrl)) {
                event = hostPath.getEvent();
                break;
            }
        }

        return event;
    }

    // endregion

    // region Data block setters

    /**
     * Fill data block with corresponding information.
     */
    private void setMessageData(ULHost host, Uri originalUri) {
        final JSONObject dataObject = new JSONObject();

        try {
            setOriginalUrl(dataObject, originalUri);
            setHostData(dataObject, host);
            setPathData(dataObject, originalUri);

            put(JSGeneralKeys.DATA, dataObject);
        } catch (JSONException e) {
            Log.d("UniversalLinks", "Failed to set event data", e);
        }
    }

    /**
     * Put launch url to the data block
     */
    private void setOriginalUrl(JSONObject dataObject, Uri originalUri) throws JSONException {
        dataObject.put(JSDataKeys.ORIGIN, originalUri.toString());
    }

    /**
     * Put host name and scheme into data block
     */
    private void setHostData(JSONObject dataObject, ULHost host) throws JSONException {
        dataObject.put(JSDataKeys.HOST, host.getName());
        dataObject.put(JSDataKeys.SCHEME, host.getScheme());
    }

    /**
     * Put path information into data block
     */
    private void setPathData(JSONObject dataObject, Uri originalUri) throws JSONException {
        dataObject.put(JSDataKeys.HASH, originalUri.getFragment());
        dataObject.put(JSDataKeys.PATH, originalUri.getPath());

        final JSONObject queryParams = getQueryParamsFromUri(originalUri);
        dataObject.put(JSDataKeys.PARAMS, queryParams);
    }

    /**
     * Parse query params.
     * For example, if we have link like so: http://somedomain.com/some/path?foo=fooVal&bar=barVal , then
     * resulting object will be {foo: fooVal, bar: barVal}.
     *
     * @return json object
     */
    private JSONObject getQueryParamsFromUri(Uri originalUri) throws JSONException, UnsupportedOperationException {
        JSONObject queryParams = new JSONObject();
        Set<String> keysList = originalUri.getQueryParameterNames();
        for (String key : keysList) {
            final String value = originalUri.getQueryParameter(key);
            queryParams.put(key, value);
        }

        return queryParams;
    }

    // endregion
}