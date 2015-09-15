//
//  CULPlugin.m
//
//  Created by Nikolay Demyankov on 14.09.15.
//

#import "CULPlugin.h"
#import "CULConfigXmlParser.h"
#import "CULPath.h"
#import "CULHost.h"

@interface CULPlugin() {
    NSString *_callbackId;
    NSArray *_supportedHosts;
}

@end

@implementation CULPlugin

- (void)pluginInitialize {
    _supportedHosts = [CULConfigXmlParser parse];
}

#pragma mark Methods to send data to JavaScript

- (void)callDefaultCallbackWithMessage {
    
}


#pragma mark Methods, available from JavaScript side

- (void)jsInitPlugin:(CDVInvokedUrlCommand *)command {
    _callbackId = command.callbackId;
}

@end
