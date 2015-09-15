//
//  AppDelegate+CULPlugin.m
//  TestUL
//
//  Created by Nikolay Demyankov on 15.09.15.
//
//

#import "AppDelegate+CULPlugin.h"

@implementation AppDelegate (CULPlugin)

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler {
    
    // https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html#//apple_ref/doc/uid/TP40016308-CH12
    
    return YES;
}

@end
