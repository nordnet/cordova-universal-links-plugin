//
//  CULHost.h
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import <Foundation/Foundation.h>
#import "CULPath.h"

@interface CULHost : NSObject

@property (nonatomic, readonly, strong) NSString *name;
@property (nonatomic, readonly, strong) NSString *scheme;
@property (nonatomic, readonly, strong) NSString *event;
@property (nonatomic, readonly, strong) NSArray *paths;

@property (nonatomic, readonly, getter=isWildcard) BOOL isWildcard;

- (instancetype)initWithHostName:(NSString *)name;
- (instancetype)initWithHostName:(NSString *)name scheme:(NSString *)scheme;
- (instancetype)initWithHostName:(NSString *)name scheme:(NSString *)scheme event:(NSString *)event;

- (void)addPath:(CULPath *)path;

@end
