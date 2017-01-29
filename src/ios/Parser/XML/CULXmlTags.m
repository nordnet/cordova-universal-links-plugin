//
//  CULXmlTags.m
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import "CULXmlTags.h"

@implementation CULXmlTags

NSString *const kCULMainXmlTag = @"universal-links";

NSString *const kCULHostXmlTag = @"host";
NSString *const kCULHostSchemeXmlAttribute = @"scheme";
NSString *const kCULHostNameXmlAttribute = @"name";
NSString *const kCULHostEventXmlAttribute = @"event";

NSString *const kCULPathXmlTag = @"path";
NSString *const kCULPathUrlXmlAttribute = @"url";
NSString *const kCULPathEventXmlAttribute = @"event";

@end
