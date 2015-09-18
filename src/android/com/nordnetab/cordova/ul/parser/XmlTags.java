package com.nordnetab.cordova.ul.parser;

/**
 * Created by Nikolay Demyankov on 10.09.15.
 * <p/>
 * XML tags that is used in config.xml to specify plugin preferences.
 */
final class XmlTags {

    /**
     * Main tag in which we define plugin related stuff
     */
    public static final String MAIN_TAG = "universal-links";

    /**
     * Host main tag
     */
    public static final String HOST_TAG = "host";

    /**
     * Scheme attribute for the host entry
     */
    public static final String HOST_SCHEME_ATTRIBUTE = "scheme";

    /**
     * Name attribute for the host entry
     */
    public static final String HOST_NAME_ATTRIBUTE = "name";

    /**
     * Event attribute for the host entry
     */
    public static final String HOST_EVENT_ATTRIBUTE = "event";

    /**
     * Path main tag
     */
    public static final String PATH_TAG = "path";

    /**
     * Url attribute for the path entry
     */
    public static final String PATH_URL_TAG = "url";

    /**
     * Event attribute for the path entry
     */
    public static final String PATH_EVENT_TAG = "event";
}
