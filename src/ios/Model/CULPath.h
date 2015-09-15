//
//  CULPath.h
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import <Foundation/Foundation.h>

@interface CULPath : NSObject

@property (nonatomic, readonly, strong) NSString *event;
@property (nonatomic, readonly, strong) NSString *url;

- (instancetype)initWithUrlPath:(NSString *)urlPath andEvent:(NSString *)event;

@end
