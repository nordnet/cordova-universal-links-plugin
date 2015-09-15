//
//  CULPlugin.h
//
//  Created by Nikolay Demyankov on 14.09.15.
//

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>

@interface CULPlugin : CDVPlugin

- (void)jsInitPlugin:(CDVInvokedUrlCommand *)command;

@end
