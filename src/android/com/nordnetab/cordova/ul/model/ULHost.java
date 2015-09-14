package com.nordnetab.cordova.ul.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Nikolay Demyankov on 09.09.15.
 *
 *
 */
public class ULHost {

    private static final String DEFAULT_EVENT = "ul_didLaunchAppFromLink";
    private static final String DEFAULT_SCHEME = "http";

    private final List<ULPath> paths;
    private final String name;
    private final String scheme;
    private final String event;

    public ULHost(final String name) {
        this(name, DEFAULT_SCHEME, DEFAULT_EVENT);
    }

    public ULHost(final String name, final String scheme) {
        this(name, scheme, DEFAULT_EVENT);
    }

    public ULHost(final String name, final String scheme, final String event) {
        this.name = name;
        this.scheme = (scheme == null) ? DEFAULT_SCHEME : scheme;
        this.event = (event == null) ? DEFAULT_EVENT : event;
        this.paths = new ArrayList<ULPath>();
    }

    public String getEvent() {
        return event;
    }

    public List<ULPath> getPaths() {
        return paths;
    }

    public String getName() {
        return name;
    }

    public String getScheme() {
        return scheme;
    }

    public boolean isWildcard() {
        return paths.size() == 0;
    }
}