//
//  CDVPluginResult+CULPlugin.m
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import "CDVPluginResult+CULPlugin.h"

static NSString *const EVENT = @"event";
static NSString *const DATA = @"data";

static NSString *const PATH_ATTRIBUTE = @"path";
static NSString *const SCHEME_ATTRIBUTE = @"scheme";
static NSString *const HOST_ATTRIBUTE = @"host";
static NSString *const HASH_ATTRIBUTE = @"hash";
static NSString *const ORIGIN_ATTRIBUTE = @"url";
static NSString *const URL_PARAMS_ATTRIBUTE = @"params";

@implementation CDVPluginResult (CULPlugin)

#pragma mark Public API

+ (instancetype)resultWithHost:(CULHost *)host originalURL:(NSURL *)originalURL {
    NSDictionary *message = [self prepareMessageForHost:host originalURL:originalURL];
    
    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
    [result setKeepCallbackAsBool:YES];
    
    return result;
}

#pragma mark Private API

+ (NSDictionary *)prepareMessageForHost:(CULHost *)host originalURL:(NSURL *)originalURL {
    NSURLComponents *urlComponents = [NSURLComponents componentsWithURL:originalURL resolvingAgainstBaseURL:YES];
    NSMutableDictionary *messageDict = [[NSMutableDictionary alloc] init];
    
    NSString *eventName = [self getEventNameBasedOnHost:host originalURLComponents:urlComponents];
    [messageDict setObject:eventName forKey:EVENT];
    
    NSDictionary *data = [self getDataDictionaryForURLComponents:urlComponents];
    [messageDict setObject:data forKey:DATA];
    
    return messageDict;
}

+ (NSString *)getEventNameBasedOnHost:(CULHost *)host originalURLComponents:(NSURLComponents *)urlComponents {
    NSString *eventName = host.event;
    NSArray<CULPath *> *hostPaths = host.paths;
    NSString *originalPath = urlComponents.path;
    
    if (originalPath.length == 0) {
        return eventName;
    }

    for (CULPath *hostPath in hostPaths) {
        NSRange range = [originalPath rangeOfString:hostPath.url options:NSRegularExpressionSearch];
        if (range.location != NSNotFound) {
            eventName = hostPath.event;
            break;
        }
    }
    
    return eventName;
}

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
