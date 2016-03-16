package com.nordnetab.cordova.ul.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Nikolay Demyankov on 09.09.15.
 * <p/>
 * Model for <host /> entry, specified in config.xml.
 */
public class ULHost {

    // default event name, that is dispatched to JS if none was set to the host or path
    private static final String DEFAULT_EVENT = "didLaunchAppFromLink";

    // default scheme for the host
    private static final String DEFAULT_SCHEME = "http";

    private final List<ULPath> paths;
    private final String name;
    private final String scheme;
    private String event;

    /**
     * Constructor
     *
     * @param name   host name
     * @param scheme host scheme
     * @param event  event that corresponds to this host
     */
    public ULHost(final String name, final String scheme, final String event) {
        this.name = name.toLowerCase();
        this.scheme = (scheme == null) ? DEFAULT_SCHEME : scheme;
        this.event = (event == null) ? DEFAULT_EVENT : event;
        this.paths = new ArrayList<ULPath>();
    }

    /**
     * Getter for the event name that is sent to JS when user clicks on the link from this host.
     * Defined as 'event' attribute.
     *
     * @return event name
     */
    public String getEvent() {
        return event;
    }

    /**
     * Setter for event name.
     *
     * @param event event name
     */
    public void setEvent(final String event) {
        this.event = event;
    }

    /**
     * Getter for the list of paths, that is set for that host in config.xml.
     *
     * @return list of hosts
     */
    public List<ULPath> getPaths() {
        return paths;
    }

    /**
     * Getter for the host name.
     * Defined as 'name' attribute.
     *
     * @return host name
     */
    public String getName() {
        return name;
    }

    /**
     * Getter for host scheme.
     * Defined as 'scheme' attribute.
     *
     * @return scheme
     */
    public String getScheme() {
        return scheme;
    }
}