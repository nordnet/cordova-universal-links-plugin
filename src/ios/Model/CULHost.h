//
//  CULHost.h
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import <Foundation/Foundation.h>
#import "CULPath.h"

/**
 *  Model for <host /> entry, specified in config.xml.
 */
@interface CULHost : NSObject

/**
 * Host name.
 * Defined as 'name' attribute.
 */
@property (nonatomic, readonly, strong) NSString *name;

/**
 *  Host scheme.
 *  Defined as 'scheme' attribute.
 */
@property (nonatomic, readonly, strong) NSString *scheme;

/**
 *  Event name that is sent to JS when user clicks on the link from this host.
 *  Defined as 'event' attribute.
 */
@property (nonatomic, strong) NSString *event;

/**
 *  List of paths, that is set for that host in config.xml.
 */
@property (nonatomic, readonly, strong) NSArray<CULPath *> *paths;

/**
 *  Constructor.
 *
 *  @param name   host name
 *  @param scheme scheme; if <code>nil</code> - http will be used
 *  @param event  event name; if <code>nil</code> - didLaunchAppFromLink event name will be used
 *
 *  @return instance of the CULHost
 */
- (instancetype)initWithHostName:(NSString *)name scheme:(NSString *)scheme event:(NSString *)event;

/**
 *  Add path entry to the host paths list.
 *
 *  @param path path to add
 */
- (void)addPath:(CULPath *)path;

@end
