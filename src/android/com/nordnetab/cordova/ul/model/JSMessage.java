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
        public static final String DOMAIN = "domain";
        public static final String HASH = "hash";
        public static final String PARAMS = "params";
        public static final String ORIGIN = "url";
    }

    public JSMessage(ULDomain domain, Uri originalUri) {
        setEventName(domain, originalUri);
        setMessageData(domain, originalUri);
    }

    private void setEventName(ULDomain domain, Uri originalUri) {
        final String event = getEventName(domain, originalUri);

        try {
            put(JSGeneralKeys.EVENT, event);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private String getEventName(ULDomain domain, Uri originalUri) {
        String event = null;
        final String originPath = originalUri.getPath();
        final List<ULPath> domainPathsList = domain.getPaths();
        for (ULPath domainPath : domainPathsList) {
            final String domainPathUrl = domainPath.getUrl();
            if (domainPathUrl == null) {
                continue;
            }

            if (originPath.matches(domainPathUrl)) {
                event = domainPath.getEvent();
                break;
            }
        }

        // set domain event name if none is specified in the paths
        if (event == null) {
            event = domain.getEvent();
        }

        return event;
    }

    private void setMessageData(ULDomain domain, Uri originalUri) {
        final JSONObject dataObject = new JSONObject();

        try {
            setOriginalUrl(dataObject, originalUri);
            setDomainData(dataObject, domain);
            setPathData(dataObject, originalUri);

            put(JSGeneralKeys.DATA, dataObject);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private void setOriginalUrl(JSONObject dataObject, Uri originalUri) throws JSONException {
        dataObject.put(JSDataKeys.ORIGIN, originalUri.toString());
    }

    private void setDomainData(JSONObject dataObject, ULDomain domain) throws JSONException {
        dataObject.put(JSDataKeys.DOMAIN, domain.getName());
        dataObject.put(JSDataKeys.SCHEME, domain.getScheme());
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