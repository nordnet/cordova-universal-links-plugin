//
//  CULConfigXmlParser.m
//
//  Created by Nikolay Demyankov on 15.09.15.
//

#import "CULConfigXmlParser.h"
#import "NSBundle+CULPlugin.h"
#import "CULPath.h"
#import "CULXmlTags.h"

@interface CULConfigXmlParser() <NSXMLParserDelegate> {
    NSMutableArray<CULHost *> *_hostsList;
    BOOL _isInsideMainTag;
    BOOL _didParseMainBlock;
    BOOL _isInsideHostBlock;
    CULHost *_processedHost;
}

@end

@implementation CULConfigXmlParser

#pragma mark Public API

+ (NSArray<CULHost *> *)parse {
    CULConfigXmlParser *parser = [[CULConfigXmlParser alloc] init];
    
    return [parser parseConfig];
}

- (NSArray<CULHost *> *)parseConfig {
    NSURL *cordovaConfigURL = [NSURL fileURLWithPath:[NSBundle pathToCordovaConfigXml]];
    NSXMLParser *configParser = [[NSXMLParser alloc] initWithContentsOfURL:cordovaConfigURL];
    if (configParser == nil) {
        NSLog(@"Failed to initialize XML parser.");
        return nil;
    }
    
    _hostsList = [[NSMutableArray alloc] init];
    [configParser setDelegate:self];
    [configParser parse];
    
    return _hostsList;
}

#pragma mark NSXMLParserDelegate implementation

- (void)parser:(NSXMLParser *)parser didStartElement:(NSString *)elementName namespaceURI:(NSString *)namespaceURI qualifiedName:(NSString *)qName attributes:(NSDictionary<NSString *,NSString *> *)attributeDict {
    if (_didParseMainBlock) {
        return;
    }
    
    if ([elementName isEqualToString:kCULMainXmlTag]) {
        _isInsideMainTag = YES;
        return;
    }
    if (!_isInsideMainTag) {
        return;
    }
    
    if ([elementName isEqualToString:kCULHostXmlTag]) {
        [self processHostTag:attributeDict];
    } else if ([elementName isEqualToString:kCULPathXmlTag]) {
        [self processPathTag:attributeDict];
    }
}

- (void)parser:(NSXMLParser *)parser didEndElement:(NSString *)elementName namespaceURI:(NSString *)namespaceURI qualifiedName:(NSString *)qName {
    if (_didParseMainBlock || !_isInsideMainTag) {
        return;
    }
    
    if ([elementName isEqualToString:kCULHostXmlTag]) {
        _isInsideHostBlock = NO;
        [_hostsList addObject:_processedHost];
    }
}

#pragma mark XML Processing

/**
 *  Parse host tag.
 *
 *  @param attributes host tag attributes
 */
- (void)processHostTag:(NSDictionary<NSString *, NSString *> *)attributes {
    _processedHost = [[CULHost alloc] initWithHostName:attributes[kCULHostNameXmlAttribute]
                                                scheme:attributes[kCULHostSchemeXmlAttribute]
                                                 event:attributes[kCULHostEventXmlAttribute]];
    _isInsideHostBlock = YES;
}

/**
 *  Parse path tag.
 *
 *  @param attributes path tag attributes
 */
- (void)processPathTag:(NSDictionary<NSString *, NSString *> *)attributes {
    NSString *urlPath = attributes[kCULPathUrlXmlAttribute];
    NSString *event = attributes[kCULPathEventXmlAttribute];
    
    // ignore '*' paths; we don't need them here
    if ([urlPath isEqualToString:@"*"] || [urlPath isEqualToString:@".*"]) {
        // but if path has event name - set it to host
        if (event) {
            _processedHost.event = event;
        }
        
        return;
    }
    
    // if event name is empty - use one from the host
    if (event == nil) {
        event = _processedHost.event;
    }
    
    // create path entry
    CULPath *path = [[CULPath alloc] initWithUrlPath:urlPath andEvent:event];
    [_processedHost addPath:path];
}

@end
