//
//  CDVInvokedUrlCommand+CULPlugin.m
//
//  Created by Nikolay Demyankov on 08.12.15.
//

#import "CDVInvokedUrlCommand+CULPlugin.h"

@implementation CDVInvokedUrlCommand (CULPlugin)

- (NSString *)eventName {
    if (self.arguments.count == 0) {
        return nil;
    }
    
    return self.arguments[0];
}

@end
