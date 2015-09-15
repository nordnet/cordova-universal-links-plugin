//
//  CULXmlTags.h
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import <Foundation/Foundation.h>

@interface CULXmlTags : NSObject

extern NSString *const kCULMainXmlTag;

extern NSString *const kCULHostXmlTag;
extern NSString *const kCULHostSchemeXmlAttribute;
extern NSString *const kCULHostNameXmlAttribute;
extern NSString *const kCULHostEventXmlAttribute;

extern NSString *const kCULPathXmlTag;
extern NSString *const kCULPathUrlXmlAttribute;
extern NSString *const kCULPathEventXmlAttribute;

@end
