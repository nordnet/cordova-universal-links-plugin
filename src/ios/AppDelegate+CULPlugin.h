//
//  AppDelegate+CULPlugin.h
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import "AppDelegate.h"

@interface AppDelegate (CULPlugin)

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler;

@end
