package com.nordnetab.cordova.ul.model;

/**
 * Created by Nikolay Demyankov on 09.09.15.
 *
 *
 */
public class ULPath {

    private final String url;
    private final String event;

    public ULPath(final String url, final String event) {
        this.url = url.replace("*", "(.*)");
        this.event = event;
    }

    public String getUrl() {
        return url;
    }

    public String getEvent() {
        return event;
    }
}
