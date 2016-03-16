//
//  CULHost.m
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import "CULHost.h"

// default event name
static NSString *const DEFAULT_EVENT = @"didLaunchAppFromLink";

// default host scheme
static NSString *const DEFAULT_SCHEME = @"http";

@interface CULHost() {
    NSMutableArray<CULPath *> *_paths;
}

@end

@implementation CULHost

- (instancetype)initWithHostName:(NSString *)name scheme:(NSString *)scheme event:(NSString *)event {
    self = [super init];
    if (self) {
        _event = event ? event : DEFAULT_EVENT;
        _scheme = scheme ? scheme : DEFAULT_SCHEME;
        _name = name.lowercaseString;
        _paths = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)addPath:(CULPath *)path {
    if (path) {
        [_paths addObject:path];
    }
}

- (NSArray<CULPath *> *)paths {
    return _paths;
}

@end
