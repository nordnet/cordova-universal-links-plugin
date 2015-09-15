//
//  CULPlugin.m
//  TestUL
//
//  Created by Nikolay Demyankov on 14.09.15.
//
//

#import "CULPlugin.h"

@interface CULPlugin() {
    NSString *callbackId;
}

@end

@implementation CULPlugin

- (void)pluginInitialize {
    
}

#pragma mark Methods to send data to JavaScript

- (void)callDefaultCallbackWithMessage {
    
}


#pragma mark Methods, available from JavaScript side

- (void)jsInitPlugin:(CDVInvokedUrlCommand *)command {
    callbackId = command.callbackId;
}

@end
