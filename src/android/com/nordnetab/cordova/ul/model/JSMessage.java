package com.nordnetab.cordova.ul.model;

import android.net.Uri;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;
import java.util.Set;

/**
 * Created by Nikolay Demyankov on 10.09.15.
 */
public class JSMessage extends JSONObject {

    private static final class JSGeneralKeys {
        public static final String EVENT = "event";
        public static final String DATA = "data";
    }

    private static final class JSDataKeys {
        public static final String PATH = "path";
        public static final String SCHEME = "scheme";
        public static final String HOST = "host";
        public static final String HASH = "hash";
        public static final String PARAMS = "params";
        public static final String ORIGIN = "url";
    }

    public JSMessage(ULHost host, Uri originalUri) {
        setEventName(host, originalUri);
        setMessageData(host, originalUri);
    }

    private void setEventName(ULHost host, Uri originalUri) {
        final String event = getEventName(host, originalUri);

        try {
            put(JSGeneralKeys.EVENT, event);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private String getEventName(ULHost host, Uri originalUri) {
        String event = null;
        final String originPath = originalUri.getPath();
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

        // set domain event name if none is specified in the paths
        if (event == null) {
            event = host.getEvent();
        }

        return event;
    }

    private void setMessageData(ULHost domain, Uri originalUri) {
        final JSONObject dataObject = new JSONObject();

        try {
            setOriginalUrl(dataObject, originalUri);
            setHostData(dataObject, domain);
            setPathData(dataObject, originalUri);

            put(JSGeneralKeys.DATA, dataObject);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private void setOriginalUrl(JSONObject dataObject, Uri originalUri) throws JSONException {
        dataObject.put(JSDataKeys.ORIGIN, originalUri.toString());
    }

    private void setHostData(JSONObject dataObject, ULHost host) throws JSONException {
        dataObject.put(JSDataKeys.HOST, host.getName());
        dataObject.put(JSDataKeys.SCHEME, host.getScheme());
    }

    private void setPathData(JSONObject dataObject, Uri originalUri) throws JSONException {
        dataObject.put(JSDataKeys.HASH, originalUri.getFragment());
        dataObject.put(JSDataKeys.PATH, originalUri.getPath());

        final JSONObject queryParams = getQueryParamsFromUri(originalUri);
        dataObject.put(JSDataKeys.PARAMS, queryParams);
    }

    private JSONObject getQueryParamsFromUri(Uri originalUri) throws JSONException, UnsupportedOperationException {
        JSONObject queryParams = new JSONObject();
        Set<String> keysList = originalUri.getQueryParameterNames();
        for (String key : keysList) {
            final String value = originalUri.getQueryParameter(key);
            queryParams.put(key, value);
        }

        return queryParams;
    }
}