package com.nordnetab.cordova.ul.parser;

import android.content.Context;

import com.nordnetab.cordova.ul.model.ULDomain;
import com.nordnetab.cordova.ul.model.ULPath;

import org.apache.cordova.ConfigXmlParser;
import org.xmlpull.v1.XmlPullParser;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Nikolay Demyankov on 09.09.15.
 */
public class ULConfigXmlParser  extends ConfigXmlParser {

    private final Context context;
    private List<ULDomain> domainsList;

    private boolean isInsideMainTag;
    private boolean didParseMainBlock;
    private boolean isInsideDomainBlock;
    private ULDomain processedDomain;

    public ULConfigXmlParser(Context context) {
        this.context = context;
    }

    public List<ULDomain> parse() {
        resetValuesToDefaultState();
        super.parse(context);

        return domainsList;
    }

    private void resetValuesToDefaultState() {
        domainsList = new ArrayList<ULDomain>();
        isInsideMainTag = false;
        didParseMainBlock = false;
        isInsideDomainBlock = false;
        processedDomain = null;
    }

    @Override
    public void handleStartTag(XmlPullParser xml) {
        if (didParseMainBlock) {
            return;
        }

        final String name = xml.getName();
        if (!isInsideMainTag && XmlTags.MAIN_TAG.equals(name)) {
            isInsideMainTag = true;
            return;
        }

        if (!isInsideMainTag) {
            return;
        }

        if (!isInsideDomainBlock && XmlTags.DOMAIN_TAG.equals(name)) {
            isInsideDomainBlock = true;
            processDomainBlock(xml);
            return;
        }

        if (isInsideDomainBlock && XmlTags.PATH_TAG.equals(name)) {
            processPathBlock(xml);
        }
    }

    @Override
    public void handleEndTag(XmlPullParser xml) {
        if (didParseMainBlock) {
            return;
        }

        final String name = xml.getName();

        if (isInsideDomainBlock && XmlTags.DOMAIN_TAG.equals(name)) {
            isInsideDomainBlock = false;
            domainsList.add(processedDomain);
            processedDomain = null;
            return;
        }

        if (XmlTags.MAIN_TAG.equals(name)) {
            isInsideMainTag = false;
            didParseMainBlock = true;
        }
    }

    private void processDomainBlock(XmlPullParser xml) {
        final String domainName = xml.getAttributeValue(null, XmlTags.DOMAIN_NAME_ATTRIBUTE);
        final String eventName = xml.getAttributeValue(null, XmlTags.DOMAIN_EVENT_ATTRIBUTE);
        final String scheme = xml.getAttributeValue(null, XmlTags.DOMAIN_SCHEME_ATTRIBUTE);

        processedDomain = new ULDomain(domainName, scheme, eventName);
    }

    private void processPathBlock(XmlPullParser xml) {
        final String url = xml.getAttributeValue(null, XmlTags.PATH_URL_TAG);
        // skip wildcard urls
        if ("*".equals(url) || ".*".equals(url)) {
            return;
        }

        String event = xml.getAttributeValue(null, XmlTags.PATH_EVENT_TAG);
        if (event == null) {
            event = processedDomain.getEvent();
        }

        ULPath path = new ULPath(url, event);
        processedDomain.getPaths().add(path);
    }
}