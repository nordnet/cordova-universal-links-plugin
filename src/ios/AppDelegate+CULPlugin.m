//
//  AppDelegate+CULPlugin.m
//
//  Created by Nikolay Demyankov on 15.09.15.
// https://github.com/phonegap-build/PushPlugin/blob/master/src/ios/AppDelegate%2Bnotification.m
//
// https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html#//apple_ref/doc/uid/TP40016308-CH12


#import "AppDelegate+CULPlugin.h"
#import "CULPlugin.h"

static NSString *const PLUGIN_NAME = @"UniversalLinks";

@implementation AppDelegate (CULPlugin)

- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler {
    if (![userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb]) {
        return NO;
    }
    
    CULPlugin *plugin = [self.viewController getCommandInstance:PLUGIN_NAME];
    
    return [plugin handleUserActivity:userActivity];
}

@end
