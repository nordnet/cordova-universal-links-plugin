//
//  CULHost.m
//  TestUL
//
//  Created by Nikolay Demyankov on 15.09.15.
//
//

#import "CULHost.h"

static NSString *const DEFAULT_EVENT = @"ul_didLaunchAppFromLink";
static NSString *const DEFAULT_SCHEME = @"http";

@interface CULHost() {
    NSMutableArray *_paths;
}

@end

@implementation CULHost

- (instancetype)initWithHostName:(NSString *)name {
    return [self initWithHostName:name scheme:DEFAULT_SCHEME];
}

- (instancetype)initWithHostName:(NSString *)name scheme:(NSString *)scheme {
    return [self initWithHostName:name scheme:scheme event:DEFAULT_EVENT];
}

- (instancetype)initWithHostName:(NSString *)name scheme:(NSString *)scheme event:(NSString *)event {
    self = [super init];
    if (self) {
        _event = event;
        _scheme = scheme;
        _name = name;
        _paths = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)addPath:(CULPath *)path {
    if (path) {
        [_paths addObject:path];
    }
}

- (NSArray *)paths {
    return _paths;
}

@end
