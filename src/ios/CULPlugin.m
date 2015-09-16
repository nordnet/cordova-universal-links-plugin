//
//  CULPlugin.m
//
//  Created by Nikolay Demyankov on 14.09.15.
//

#import "CULPlugin.h"
#import "CULConfigXmlParser.h"
#import "CULPath.h"
#import "CULHost.h"
#import "CDVPluginResult+CULPlugin.h"

@interface CULPlugin() {
    NSString *_defaultCallbackId;
    NSArray *_supportedHosts;
    CDVPluginResult *_storedMessage;
}

@end

@implementation CULPlugin

- (void)pluginInitialize {
    [self localInit];
    
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onResume:) name:UIApplicationWillEnterForegroundNotification object:nil];
}

//- (void)onResume:(NSNotification *)notification {
//    NSUserActivity *activity = [[NSUserActivity alloc] initWithActivityType:NSUserActivityTypeBrowsingWeb];
//    [activity setWebpageURL:[NSURL URLWithString:@"http://extended.example.com/another/path/very/long?q=1&v=2#myhash"]];
//    
//    [self handleUserActivity:activity];
//}


- (BOOL)handleUserActivity:(NSUserActivity *)userActivity {
    [self localInit];
    
    NSURL *launchURL = userActivity.webpageURL;
    CULHost *host = [self findHostByURL:launchURL];
    if (host == nil) {
        return NO;
    }
    
    [self sendEventToJSWithHost:host originalURL:launchURL];
    
    return YES;
}

#pragma mark Private API

- (void)localInit {
    if (_supportedHosts) {
        return;
    }
    
    _supportedHosts = [CULConfigXmlParser parse];
}

- (CULHost *)findHostByURL:(NSURL *)launchURL {
    NSURLComponents *urlComponents = [NSURLComponents componentsWithURL:launchURL resolvingAgainstBaseURL:YES];
    CULHost *host = nil;
    for (CULHost *supportedHost in _supportedHosts) {
        if ([supportedHost.name isEqualToString:urlComponents.host] && [supportedHost.scheme isEqualToString:urlComponents.scheme]) {
            host = supportedHost;
            break;
        }
    }
    
    return host;
}

#pragma mark Methods to send data to JavaScript

- (void)sendEventToJSWithHost:(CULHost *)host originalURL:(NSURL *)originalUrl {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithHost:host originalURL:originalUrl];
    
    if (_defaultCallbackId == nil) {
        _storedMessage = pluginResult;
        return;
    }
    
    [self dispatchPluginResult:pluginResult];
}

- (void)dispatchPluginResult:(CDVPluginResult *)result {
    [self.commandDelegate sendPluginResult:result callbackId:_defaultCallbackId];
}

#pragma mark Methods, available from JavaScript side

- (void)jsInitPlugin:(CDVInvokedUrlCommand *)command {
    _defaultCallbackId = command.callbackId;
    
    if (_storedMessage) {
        [self dispatchPluginResult:_storedMessage];
        _storedMessage = nil;
    }
}

@end
