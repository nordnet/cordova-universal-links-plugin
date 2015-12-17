//
//  CDVPluginResult+CULPlugin.h
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import <Cordova/CDVPlugin.h>
#import "CULHost.h"

/**
 *  Category to simplify plugin result generation.
 */
@interface CDVPluginResult (CULPlugin)

/**
 *  Get CDVPluginResult instance with information about the launch url that is send to JS.
 *
 *  @param host        host that corresponds to launch url
 *  @param originalURL launching url
 *
 *  @return instance of the CDVPluginResult
 */
+ (instancetype)resultWithHost:(CULHost *)host originalURL:(NSURL *)originalURL;

- (BOOL)isResultForEvent:(NSString *)eventName;

- (NSString *)eventName;

@end
