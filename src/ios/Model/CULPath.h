//
//  CULPath.h
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import <Foundation/Foundation.h>

/**
 *  Model for <path /> entry for host in config.xml.
 */
@interface CULPath : NSObject

/**
 *  Event name that is dispatched when application is launched from the link with this path.
 *  Defined as 'event' attribute.
 */
@property (nonatomic, readonly, strong) NSString *event;

/**
 *  Path url.
 *  Defined as 'url' attribute.
 */
@property (nonatomic, readonly, strong) NSString *url;

/**
 *  Constructor
 *
 *  @param urlPath url path
 *  @param event   event name
 *
 *  @return instance of the CULPath
 */
- (instancetype)initWithUrlPath:(NSString *)urlPath andEvent:(NSString *)event;

@end
