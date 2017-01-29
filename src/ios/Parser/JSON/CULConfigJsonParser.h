//
//  CULConfigJsonParser.h
//
//  Created by Nikolay Demyankov on 29.01.17.
//

#import <Foundation/Foundation.h>
#import "CULHost.h"

/**
 *  JSON parser for plugin's preferences.
 */
@interface CULConfigJsonParser : NSObject

/**
 *  Parse JSON config.
 *
 *  @return list of hosts, defined in the config file
 */
+ (NSArray<CULHost *> *)parseConfig:(NSString *)pathToJsonConfig;

@end
