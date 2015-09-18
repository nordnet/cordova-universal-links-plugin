//
//  CULXmlTags.h
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import <Foundation/Foundation.h>

/**
 *  XML tags that is used in config.xml to specify plugin preferences.
 */
@interface CULXmlTags : NSObject

/**
 *  Main tag in which we define plugin related stuff
 */
extern NSString *const kCULMainXmlTag;

/**
 *  Host main tag
 */
extern NSString *const kCULHostXmlTag;

/**
 *  Scheme attribute for the host entry
 */
extern NSString *const kCULHostSchemeXmlAttribute;

/**
 *  Name attribute for the host entry
 */
extern NSString *const kCULHostNameXmlAttribute;

/**
 *  Event attribute for the host entry
 */
extern NSString *const kCULHostEventXmlAttribute;

/**
 *  Path main tag
 */
extern NSString *const kCULPathXmlTag;

/**
 *  Url attribute for the path entry
 */
extern NSString *const kCULPathUrlXmlAttribute;

/**
 *  Event attribute for the path entry
 */
extern NSString *const kCULPathEventXmlAttribute;

@end
