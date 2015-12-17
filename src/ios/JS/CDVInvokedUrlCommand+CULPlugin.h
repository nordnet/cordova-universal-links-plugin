//
//  CDVInvokedUrlCommand+CULPlugin.h
//
//  Created by Nikolay Demyankov on 08.12.15.
//

#import <Cordova/CDVPlugin.h>

/**
 *  Category to get the event name from the request, that is sent from JS side.
 */
@interface CDVInvokedUrlCommand (CULPlugin)

/**
 *  Get event name from JS request.
 *
 *  @return event name
 */
- (NSString *)eventName;

@end
