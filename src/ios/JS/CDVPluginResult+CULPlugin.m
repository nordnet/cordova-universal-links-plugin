//
//  CDVPluginResult+CULPlugin.m
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import "CDVPluginResult+CULPlugin.h"

#pragma mark keys for the message structure

// event name
static NSString *const EVENT = @"event";

// message data block
static NSString *const DATA = @"data";

#pragma mark keys for the message data block

// path part from the url
static NSString *const PATH_ATTRIBUTE = @"path";

// scheme from the url
static NSString *const SCHEME_ATTRIBUTE = @"scheme";

// host name from the url
static NSString *const HOST_ATTRIBUTE = @"host";

// hash (fragment) from the url; data after '#'
static NSString *const HASH_ATTRIBUTE = @"hash";

// launch url without any changes
static NSString *const ORIGIN_ATTRIBUTE = @"url";

// query parameters from the url; data after '?'
static NSString *const URL_PARAMS_ATTRIBUTE = @"params";

@implementation CDVPluginResult (CULPlugin)

#pragma mark Public API

+ (instancetype)resultWithHost:(CULHost *)host originalURL:(NSURL *)originalURL {
    NSDictionary *message = [self prepareMessageForHost:host originalURL:originalURL];
    
    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
    [result setKeepCallbackAsBool:YES];
    
    return result;
}

- (BOOL)isResultForEvent:(NSString *)eventName {
    NSString *eventInMessage = [self eventName];
    if (eventInMessage.length == 0 || eventName.length == 0) {
        return NO;
    }
    
    return [eventInMessage isEqualToString:eventName];
}

- (NSString *)eventName {
    if (self.message == nil || ![self.message isKindOfClass:[NSDictionary class]]) {
        return nil;
    }
    
    NSDictionary *data = self.message;
    
    return data[EVENT];
}

#pragma mark Private API

/**
 *  Create dictionary for message, that should be send to JS.
 *  Holds event name and event details.
 *
 *  @param host        host entry that corresponds to the url
 *  @param originalURL launch url
 *
 *  @return messasge dictionary
 */
+ (NSDictionary *)prepareMessageForHost:(CULHost *)host originalURL:(NSURL *)originalURL {
    NSURLComponents *urlComponents = [NSURLComponents componentsWithURL:originalURL resolvingAgainstBaseURL:YES];
    NSMutableDictionary *messageDict = [[NSMutableDictionary alloc] init];
    
    // set event name
    NSString *eventName = [self getEventNameBasedOnHost:host originalURLComponents:urlComponents];
    [messageDict setObject:eventName forKey:EVENT];
    
    // set event details
    NSDictionary *data = [self getDataDictionaryForURLComponents:urlComponents];
    [messageDict setObject:data forKey:DATA];
    
    return messageDict;
}

/**
 *  Find event name based on the launch url and corresponding host entry.
 *
 *  @param host          host entry
 *  @param urlComponents launch url components
 *
 *  @return event name
 */
+ (NSString *)getEventNameBasedOnHost:(CULHost *)host originalURLComponents:(NSURLComponents *)urlComponents {
    NSString *eventName = host.event;
    NSArray<CULPath *> *hostPaths = host.paths;
    NSString *originalPath = urlComponents.path.lowercaseString;
    
    if (originalPath.length == 0) {
        return eventName;
    }

    for (CULPath *hostPath in hostPaths) {
        NSRange range = [originalPath rangeOfString:hostPath.url options:NSRegularExpressionSearch];
        if (range.location != NSNotFound && range.location == 0) {
            eventName = hostPath.event;
            break;
        }
    }
    
    return eventName;
}

/**
 *  Create dictionary with event details.
 *
 *  @param originalURLComponents launch url components
 *
 *  @return dictionary with url information
 */
+ (NSDictionary *)getDataDictionaryForURLComponents:(NSURLComponents *)originalURLComponents {
    NSMutableDictionary *dataDict = [[NSMutableDictionary alloc] init];
    
    NSString *originUrl = originalURLComponents.URL.absoluteString;
    NSString *host = originalURLComponents.host ? originalURLComponents.host : @"";
    NSString *path = originalURLComponents.path ? originalURLComponents.path : @"";
    NSString *scheme = originalURLComponents.scheme ? originalURLComponents.scheme : @"";
    NSString *hash = originalURLComponents.fragment ? originalURLComponents.fragment : @"";

    [dataDict setObject:originUrl forKey:ORIGIN_ATTRIBUTE];
    [dataDict setObject:host forKey:HOST_ATTRIBUTE];
    [dataDict setObject:path forKey:PATH_ATTRIBUTE];
    [dataDict setObject:scheme forKey:SCHEME_ATTRIBUTE];
    [dataDict setObject:hash forKey:HASH_ATTRIBUTE];
    
    // set query params
    NSArray<NSURLQueryItem *> *queryItems = originalURLComponents.queryItems;
    NSMutableDictionary<NSString *, NSString *> *qParams = [[NSMutableDictionary alloc] init];
    for (NSURLQueryItem *qItem in queryItems) {
        NSString *value = qItem.value ? qItem.value : @"";
        [qParams setValue:value forKey:qItem.name];
    }
    [dataDict setObject:qParams forKey:URL_PARAMS_ATTRIBUTE];
    
    return dataDict;
}

@end
