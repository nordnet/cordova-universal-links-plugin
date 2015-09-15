//
//  NSBundle+CULPlugin.h
//  TestUL
//
//  Created by Nikolay Demyankov on 15.09.15.
//
//

#import <Foundation/Foundation.h>

@interface NSBundle (CULPlugin)

/**
 *  Path to the config.xml file in the project.
 *
 *  @return path to the config file
 */
+ (NSString *)pathToCordovaConfigXml;


@end
