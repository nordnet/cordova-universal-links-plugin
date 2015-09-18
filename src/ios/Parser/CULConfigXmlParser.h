//
//  CULConfigXmlParser.h
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import <Foundation/Foundation.h>
#import "CULHost.h"

/**
 *  Parser for config.xml. Reads only plugin-specific preferences.
 */
@interface CULConfigXmlParser : NSObject

/**
 *  Parse config.xml
 *
 *  @return list of hosts, defined in the config file
 */
+ (NSArray<CULHost *> *)parse;

@end
