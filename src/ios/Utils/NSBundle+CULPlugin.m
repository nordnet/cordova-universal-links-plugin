//
//  NSBundle+CULPlugin.m
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import "NSBundle+CULPlugin.h"

@implementation NSBundle (CULPlugin)

+ (NSString *)pathToCordovaConfigXml {
    return [[NSBundle mainBundle] pathForResource:@"config" ofType:@"xml"];
}

@end
