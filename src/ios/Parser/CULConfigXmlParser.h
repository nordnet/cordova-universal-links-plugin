//
//  CULConfigXmlParser.h
//  TestUL
//
//  Created by Nikolay Demyankov on 15.09.15.
//
//

#import <Foundation/Foundation.h>
#import "CULHost.h"

@interface CULConfigXmlParser : NSObject

+ (NSArray<CULHost *> *)parse;

@end
