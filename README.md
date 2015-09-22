# Cordova Universal Links Plugin

Plugin adds support for opening application from the browser when user clicks on some link. Better known as:

- [Universal Links on iOS](https://developer.apple.com/library/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html)
- [Deep Linking on Android](https://developer.android.com/training/app-indexing/deep-linking.html)

Integration process is simple:

1. Add plugin to your project.
2. Define supported hosts and paths in Cordova's `config.xml`.
3. Write some JavaScript code to listen for application launch by the links.
4. Build project from the CLI.
5. Add web hooks to your website.

It is important not only to redirect user to your app from the web, but also provide him with the information he was looking for. For example, if he clicks on `http://mysite.com/news` and get redirected in the application - he probably hope to see the `news` page in it. Plugin will help developer with that. In `config.xml` you can specify event name that is dispatched when user opens the app from the certain link. This way, appropriate method of your web project will be called, and you can show user the requested content.

**Note:** at the moment plugin doesn't support custom url schemes, but may be added later if lots of people would want that.

## Supported Platforms
- Android 4.0.0 or above.
- iOS 9.0 or above. Xcode 7 is required.

## Documentation

- [Installation](#installation)
- [Cordova config preferences](#cordova-config-preferences)
- [Configuring website](#configuring-website)
  - [Configure for Android](#configure-for-android)
  - [Configure for iOS](#configure-for-ios)
- [How to test](#how-to-test)
  - [Testing Android](#testing-android)
  - [Testing iOS](#testing-ios)
- [Links for additional documentation](#links-for-additional-documentation)

### Installation

This requires cordova 5.0+ (current stable 1.0.0)
```sh
cordova plugin add cordova-universal-links-plugin
```

It is also possible to install via repo url directly (__unstable__)
```sh
cordova plugin add https://github.com/nordnet/cordova-universal-links-plugin.git
```

### Cordova config preferences

Cordova uses `config.xml` file to set different project preferences: name, description, starting page and so on. Using this config file you can also set options for the plugin.

Those preferences are specified inside the `<universal-links>` block. For example:
```xml
<universal-links>
    <host name="example.com">
        <path url="/some/path" />
    </host>
</universal-links>
```
In it you define hosts and paths that application should handle. You can have as many hosts and paths as you like.

##### host

`<host />` tag lets you describe hosts, that your application supports. It can have three attributes:
- `name` - hostname. __This is a required attribute.__
- `scheme` - supported url scheme. Should be either `http` or `https`. If not set - `http` is used.
- `event` - name of the event that is dispatched on JavaScript side when application is launched from the link with the given hostname. If not set - `ul_didLaunchAppFromLink` event name is used.

For example,
```xml
<universal-links>
    <host name="example.com" scheme="https" event="ul_myExampleEvent" />
</universal-links>
```
defines, that when user clicks on any `https://example.com` link - `ul_myExampleEvent` is dispatched to the JavaScript side. You can subscribe to it and act properly. More details regarding event handling can be found below (__LINK REQUIRED__).

##### path
In `<path />` tag you define which paths for the given host you want to support. If no `<path />` is set - then we want to handle all host links. If paths are defined - then application will handle only links with those paths.

There are two supported attributes:
- `url` - path component of the url; should be relative to the host name. __This is a required attribute.__
- `event` - name of the event that is dispatched on JavaScript side when application is launched from the link with the given hostname and path. If not set - `ul_didLaunchAppFromLink` event name is used.

For example,
```xml
<universal-links>
    <host name="example.com">
        <path url="/some/path" />
    </host>
</universal-links>
```
defines, that when user click on `http://example.com/some/path` - application will be launched and event `ul_didLaunchAppFromLink` is send to JavaScript side. All other links from that host will be ignored.

Query parameters are not used for link matching. For example, `http://example.com/some/path?foo=bar#some_tag` will work the same way as `http://example.com/some/path` does.

In order to support all links inside `/some/path/` you can use `*` like so:
```xml
<universal-links>
    <host name="example.com">
        <path url="/some/path/*" />
    </host>
</universal-links>
```
`*` can be used only for paths, but you can place it anywhere. For example,
```xml
<universal-links>
    <host name="example.com">
        <path url="*mypath*" />
    </host>
</universal-links>
```
states, that application can handle any link from `http://example.com` which has `mypath` string in his path component: `http://example.com/some/long/mypath/test.html`, `http://example.com/testmypath.html` and so on.

**Note:** following
```xml
<universal-links>
    <host name="example.com" />
</universal-links>
```
is the same as:
```xml
<universal-links>
    <host name="example.com">
      <path url="*" />
    </host>
</universal-links>
```

### Links for additional documentation
Android:
- [Enable Deep Linking on Android](https://developer.android.com/training/app-indexing/deep-linking.html)
- [Specifying App Content for Indexing](https://developer.android.com/training/app-indexing/enabling-app-indexing.html)

iOS:
- [Apple documentation on Universal Links](https://developer.apple.com/library/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html)
- [How to setup universal links on iOS 9](https://blog.branch.io/how-to-setup-universal-links-to-deep-link-on-apple-ios-9)
- [Branch.io documentation on universal links](https://dev.branch.io/recipes/branch_universal_links/#enable-universal-links-on-the-branch-dashboard)
