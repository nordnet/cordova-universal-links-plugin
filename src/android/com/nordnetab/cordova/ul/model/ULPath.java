package com.nordnetab.cordova.ul.model;

/**
 * Created by Nikolay Demyankov on 09.09.15.
 * <p/>
 * Model for <path /> entry for host in config.xml
 */
public class ULPath {

    private final String url;
    private final String event;

    /**
     * Constructor
     *
     * @param url   path url
     * @param event event name
     */
    public ULPath(final String url, final String event) {
        this.url = url.replace("*", "(.*)").toLowerCase();
        this.event = event;
    }

    /**
     * Getter for path url.
     * Defined as 'url' attribute.
     *
     * @return path url
     */
    public String getUrl() {
        return url;
    }

    /**
     * Getter for the event name that is dispatched when application is launched from the link with this path.
     * Defined as 'event' attribute.
     *
     * @return event name
     */
    public String getEvent() {
        return event;
    }
}
