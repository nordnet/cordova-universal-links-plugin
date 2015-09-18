//
//  NSBundle+CULPlugin.h
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import <Foundation/Foundation.h>

/**
 *  Helper category to work with NSBundle.
 */
@interface NSBundle (CULPlugin)

/**
 *  Path to the config.xml file in the project.
 *
 *  @return path to the config file
 */
+ (NSString *)pathToCordovaConfigXml;


@end
