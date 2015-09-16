//
//  CDVPluginResult+CULPlugin.h
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import <Cordova/CDVPlugin.h>
#import "CULHost.h"

@interface CDVPluginResult (CULPlugin)

+ (instancetype)resultWithHost:(CULHost *)host originalURL:(NSURL *)originalURL;

@end
