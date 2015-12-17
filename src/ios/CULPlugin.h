//
//  CULPlugin.h
//
//  Created by Nikolay Demyankov on 14.09.15.
//

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>

/**
 *  Plugin main class.
 */
@interface CULPlugin : CDVPlugin

/**
 *  Subscribe to event.
 *
 *  @param command command from js side with event name and callback id.
 */
- (void)jsSubscribeForEvent:(CDVInvokedUrlCommand *)command;

/**
 *  Unsubscribe from event.
 *
 *  @param command command from js side with event name
 */
- (void)jsUnsubscribeFromEvent:(CDVInvokedUrlCommand *)command;

/**
 *  Try to hanlde application launch when user clicked on the link.
 *
 *  @param userActivity object with information about the application launch
 *
 *  @return <code>true</code> - if this is a universal link and it is defined in config.xml; otherwise - <code>false</code>
 */
- (BOOL)handleUserActivity:(NSUserActivity *)userActivity;

@end
