# Cordova Universal Links Plugin
Plugin adds support for opening application from the browser when user clicks on some link. Better known as:
- [Universal Links on iOS](https://developer.apple.com/library/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html)
- [Deep Linking on Android](https://developer.android.com/training/app-indexing/deep-linking.html)

Basically, you can have a single link that will either open your app (if it is installed) or your website (if it's not).

Integration process is simple:

1. Add plugin to your project (see [Installation](#installation)).
2. Define supported hosts and paths in Cordova's `config.xml` (see [Cordova config preferences](#cordova-config-preferences)).
3. Write some JavaScript code to listen for application launch by the links (see [Application launch handling](#application-launch-handling)).
4. Build project from the CLI.
5. Activate support for UL on your website (see [Android web integration](#android-web-integration) and [iOS web integration](#configuring-ios-application)). For iOS you will have to do some tweaks in [developer.apple.com](#activating-ul-support-in-member-center).
6. Test it (see [Test UL for Android locally](#testing-ul-for-android-locally) and [Testing iOS application](#testing-ios-application)).

It is important not only to redirect user to your app from the web, but also provide him with the information he was looking for. For example, if he clicks on `http://mysite.com/news` and get redirected in the application - he probably hope to see the `news` page in it. Plugin will help developer with that. In `config.xml` you can specify event name that is dispatched when user opens the app from the certain link. This way, appropriate method of your web project will be called, and you can show user the requested content.

**Note:** At the moment plugin doesn't support custom url schemes, but their support may be added later, if people will ask.

## Supported Platforms
- Android 4.0.0 or above.
- iOS 9.0 or above. Xcode 7 is required.

## Documentation
- [Installation](#installation)
- [Cordova config preferences](#cordova-config-preferences)
- [Application launch handling](#application-launch-handling)
- [Android web integration](#android-web-integration)
- [iOS web integration](#ios-web-integration)
  - [Activating UL support in member center](#activating-ul-support-in-member-center)
  - [Configuring apple-app-site-association file for website](#configuring-apple-app-site-association-file-for-website)
- [Testing UL for Android locally](#testing-ul-for-android-locally)
- [Testing iOS application](#testing-ios-application)
- [Links for additional documentation](#links-for-additional-documentation)

### Installation
This requires cordova 5.0+ (current stable 1.0.0)

```sh
cordova plugin add cordova-universal-links-plugin
```

It is also possible to install via repo url directly (**unstable**)

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

#### host
`<host />` tag lets you describe hosts, that your application supports. It can have three attributes:
- `name` - hostname. **This is a required attribute.**
- `scheme` - supported url scheme. Should be either `http` or `https`. If not set - `http` is used.
- `event` - name of the event that is dispatched on JavaScript side when application is launched from the link with the given hostname. If not set - `ul_didLaunchAppFromLink` event name is used.

For example,

```xml
<universal-links>
    <host name="example.com" scheme="https" event="ul_myExampleEvent" />
</universal-links>
```

defines, that when user clicks on any `https://example.com` link - `ul_myExampleEvent` is dispatched to the JavaScript side. You can subscribe to it and act properly. More details regarding event handling can be found [below](#application-launch-handling).

#### path
In `<path />` tag you define which paths for the given host you want to support. If no `<path />` is set - then we want to handle all host links. If paths are defined - then application will handle only links with those paths.

There are two supported attributes:
- `url` - path component of the url; should be relative to the host name. **This is a required attribute.**
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

**Note:** Following configuration

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

### Application launch handling
As we have already mentioned - it is not enough just to redirect user into your app, you need to show him content that he was looking for. In order to help you with that - plugin will send appropriate event with url data to the JavaScript side. By default, event name is `ul_didLaunchAppFromLink`, but you can specify any name for any host/path combination by using `event` attribute.

To subscribe for default UL event in JavaScript - use `document.addEventListener` like so:

```js
document.addEventListener('ul_didLaunchAppFromLink', didLaunchAppFromLink, false);

function didLaunchAppFromLink(event) {
  var urlData = event.detail;
  console.log('Did launch application from the link: ' + urlData.url);
  // do some work
}
```

`event.detail` holds information about the launching url. For example, for `http://myhost.com/news/ul-plugin-released.html?foo=bar#cordova-news` it will be:

```json
{
  "url": "http://myhost.com/news/ul-plugin-released.html?foo=bar#cordova-news",
  "scheme": "http",
  "host": "myhost.com",
  "path": "/news/ul-plugin-released.html",
  "params": {
    "foo": "bar"
  },
  "hash": "cordova-news"
}
```

- `url` - original launch url;
- `scheme` - url scheme;
- `host` - hostname from the url;
- `path` - path component of the url;
- `params` - dictionary with query parameters; the ones that after `?` character;
- `hash` - content after `#` character.

Now it's time for some examples. In here we are gonna use Android, because it is easier to test (see [testing for Android](#testing-ul-for-android-locally) section). JavaScript side is platform independent, so all the example code below will also work for iOS.

1. Create new Cordova application and add Android platform.

  ```sh
  cordova create TestAndroidApp com.example.ul TestAndroidApp
  cd ./TestAndroidApp
  cordova platform add android
  ```

2. Add UL plugin:

  ```sh
  cordova plugin add cordova-universal-links-plugin
  ```

3. Add `<universal-links>` preference into `config.xml`:

  ```xml
  <!-- some other data from config.xml -->
  <universal-links>
   <host name="myhost.com">
     <path url="/news/" event="openNewsListPage" />
     <path url="/news/*" event="openNewsDetailedPage" />
   </host>
  </universal-links>
  ```

  As you can see - we want our application to be launched, when user goes to the `news` section of our website. And for that - we are gonna dispatch different events to understand, what has happened.

4. Subscribe to `openNewsListPage` and `openNewsDetailedPage` events. For that - open `www/js/index.js` and make it look like that:

  ```js
  var app = {
    // Application Constructor
    initialize: function() {
      this.bindEvents();
    },

    // Bind Event Listeners
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
      document.addEventListener('openNewsListPage', this.onNewsListPageRequested, false);
      document.addEventListener('openNewsDetailedPage', this.onNewsDetailedPageRequested, false);
    },

    // deviceready Event Handler
    onDeviceReady: function() {
      console.log('Handle deviceready event if you need.');
    },

    // openNewsListPage Event Handler
    onNewsListPageRequested: function(event) {
      console.log('Showing to user list of awesome news.');

      // do some work to show list of news
    },

    // openNewsDetailedPage Event Handler
    onNewsDetailedPageRequested: function(event) {
      var linkData = event.detail;
      console.log('Showing to user details page: ' + linkData.path);

      // do some work to show detailed page
    }
  };

  app.initialize();
  ```

  With that, if user clicks on `http://myhost.com/news/` link - method `onNewsListPageRequested` will be called, and for every link like `http://myhost.com/news/*` - `onNewsDetailedPageRequested`. Basically, we created a mapping between the links and JavaScript methods.

5. Build and run your application:

  ```sh
  cordova run android
  ```

6. Close your app.

7. Execute in the terminal:

  ```sh
  adb shell am start -W -a android.intent.action.VIEW -d "http://myhost.com/news/" com.example.ul
  ```

  As a result, your application will be launched, and in JavaScript console you will see message:

  ```
  Showing to user list of awesome news.
  ```

  Repeat operation, but this time with the command:

  ```sh
  adb shell am start -W -a android.intent.action.VIEW -d "http://myhost.com/news/ul-plugin-released.html" com.example.ul
  ```

  Application will be launched and you will see in JS console:

  ```
  Showing to user details page: /news/ul-plugin-released.html
  ```

Now, let's say, you want your app to handle all links from `myhost.com`, but you need to keep the mapping for the paths. For that you just need to modify your `config.xml` and add default event handler on JavaScript side:

1. Open `config.xml` and change `<universal-links>` block like so:

  ```xml
  <universal-links>
   <host name="myhost.com">
     <path url="/news/" event="openNewsListPage" />
     <path url="/news/*" event="openNewsDetailedPage" />
     <path url="*" />
   </host>
  </universal-links>
  ```

  As you can see - we added `*` as `path`. This way we declared, that application should be launched from any `http://myhost.com` link.

2. Add handling for default UL event in the `www/js/index.js`:

  ```js
  var app = {
    // Application Constructor
    initialize: function() {
      this.bindEvents();
    },

    // Bind Event Listeners
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
      document.addEventListener('openNewsListPage', this.onNewsListPageRequested, false);
      document.addEventListener('openNewsDetailedPage', this.onNewsDetailedPageRequested, false);
      document.addEventListener('ul_didLaunchAppFromLink', this.onApplicationDidLaunchFromLink, false);
    },

    // deviceready Event Handler
    onDeviceReady: function() {
      console.log('Handle deviceready event if you need');
    },

    // openNewsListPage Event Handler
    onNewsListPageRequested: function(event) {
      console.log('Showing to user list of awesome news');

      // do some work to show list of news
    },

    // openNewsDetailedPage Event Handler
    onNewsDetailedPageRequested: function(event) {
      console.log('Showing to user details page for some news');

      // do some work to show detailed page
    },

    // ul_didLaunchAppFromLink Event Handler
    onApplicationDidLaunchFromLink: function(event) {
      var linkData = event.detail;
      console.log('Did launch app from the link: ' + linkData.url);
    }
  };

  app.initialize();
  ```

That's it! Now, by default for `myhost.com` links `onApplicationDidLaunchFromLink` method will be called, but for `news` section - `onNewsListPageRequested` and `onNewsDetailedPageRequested`.

### Android web integration

If you have already tried to use `adb` to simulate application launch from the link - you probably saw chooser dialog with at least two applications in it: browser and your app. This happens because web content can be handled by multiple things. To prevent this from happening you need to activate app indexing. App indexing is the second part of deep linking, where you link that URI/URL between Google and your app. Even when users do a Google search, search results can bring them back to the app.

More details on that could be found in the [official documentation](https://developer.android.com/training/app-indexing/enabling-app-indexing.html). But long story short - you need to include proper `<link />` tags in the `<head />` section of your website.

Link tag is constructed like so:

```html
<link rel="alternate"
          href="android-app://<package_name>/<scheme>/<host><path>" />
```

- `<package_name>` - your application's package name;
- `<scheme>` - url scheme;
- `<host>` - hostname;
- `<path>` - path component.

For example, if your `config.xml` file looks like that:

```xml
<universal-links>
 <host name="myhost.com">
   <path url="/news/" />
   <path url="/profile/" />
 </host>
</universal-links>
```

and a package name is `com.example.ul`, then `<head />` section on your website will be:

```html
<head>
<link rel="alternate" href="android-app://com.example.ul/http/myhost.com/news/" />
<link rel="alternate" href="android-app://com.example.ul/http/myhost.com/profile/" />

<!-- Your other stuff from the head tag -->
</head>
```

Good news is that plugin generates those tags for you. When you run `cordova build` (or `cordova run`) - they are placed in `ul_web_hooks/android/android_web_hook.html` file inside your Cordova's project root directory.

So, instead of manually writing them down - you can take them from that file and put on the website.

### iOS web integration

In the case of iOS integration of the Universal Links is a little harder. It consist of two steps:

1. Register your application on [developer console](https://developers.apple.com) and enable `Associated Domains` feature for it.
2. Generate, sign and upload `apple-app-site-association` file on your website (if you don't have it yet).

First one you will have to do manually, but plugin will help you with the second step.

#### Activating UL support in member center

1. Go to your [developer console](https://developers.apple.com). Click on `Certificate, Identifiers & Profiles` and then on `Identifiers`.

![Developer console](docs/images/1.jpg?raw=true "Optional Title")

2. If you already have a registered App Identifier - just skip this and go to `3`. If not - create it by clicking on `+` sign, fill out `name` and `bundle ID`. `name` can be whatever you want, but `bundle ID` should be the one you defined in your Cordova's `config.xml`.

[IMAGE GOES HERE]

3. In the `Application Services` section of your App Identifier activate `Associated Domains` and save the changes.

[IMAGE GOES HERE]

Now your App ID is registered and has `Associated Domains` feature.

#### Configuring apple-app-site-association file for website

In order for Universal Links to work - you need to associate your application with the certain domain. For that you need to:

1. Get SSL certification for your domain name.
2. Create `apple-app-site-association` file, containing your App ID and paths you want to handle.
3. Sign it with SSL certificate.
4. Upload `apple-app-site-association` file in the root of your website.

##### Step 1

We are not gonna describe stuff regarding certificate acquiring. You can find lots of information about that on the Internet. For example, you can do as described [here](https://blog.branch.io/how-to-setup-universal-links-to-deep-link-on-apple-ios-9):

1. Visit [https://www.digicert.com/easy-csr/openssl.htm](https://www.digicert.com/easy-csr/openssl.htm) and fill out the form at the top to generate an openSSL command. Keep this window open.
2. Login to your remote server.
3. Execute the openSSL command to generate a certificate signing request (.csr) and certification file (.cert).
4. Pay for your SSL certification at [https://www.digicert.com/welcome/ssl-plus.htm](https://www.digicert.com/welcome/ssl-plus.htm).
5. Wait for Digicert to approve and send you the final files.
6. In the end, move `yourdomain.com.cert`, `yourdomain.com.key` and `digicertintermediate.cert` into the same directory on your remote server.

##### Step 2

When you run `cordova build` (or `cordova run`) - plugin takes data from `config.xml` and generates `apple-app-site-association` files for each host you defined. Files are placed in the `ul_web_hooks/ios/` folder of your Cordova project under the names `<hostname>#apple-app-site-association`.

For example, let's say your application's bundle ID is `com.example.ul`, and `config.xml` has several hosts:

```xml
<universal-links>
  <host name="firsthost.com">
    <path url="/some/path/*" />
  </host>
  <host name="secondhost.com" />
</universal-links>
```

Run `cordova build` and then go to `ul_web_hooks/ios/` folder in your Cordova project. You will see there two files:

```
firsthost.com#apple-app-site-association
secondhost.com#apple-app-site-association
```

Content of the first one is:
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "<YOUR_TEAM_ID_FROM_MEMBER_CENTER>.com.example.ul",
        "paths": [
          "/some/path/*"
        ]
      }
    ]
  }
}
```

And the second one:
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "<YOUR_TEAM_ID_FROM_MEMBER_CENTER>.com.example.ul",
        "paths": [
          "*"
        ]
      }
    ]
  }
}
```

Before signing those files and uploading them on your servers - you need to replace `<YOUR_TEAM_ID_FROM_MEMBER_CENTER>` with your actual team ID from the member center. You can find it in `Developer Account Summary` section on the [developer.apple.com](https://developer.apple.com/membercenter/index.action#accountSummary).

[IMAGE GOES HERE]

Also, it is a `Prefix` preference in the App ID description.

[IMAGE GOES HERE]

If you already have `apple-app-site-association` file - then you need to add `applinks` block to it from the generated file.

##### Step 3

Again, you can find on the Internet lots of information regarding singing file with SSL certificate.

Continuing previous example, you can do it like that:

```
cat firsthost.com#apple-app-site-association | openssl smime -sign -inkey firsthost.com.key
                                                -signer firsthost.com.cert
                                                -certfile intermediate.cert
                                                -noattr -nodetach
                                                -outform DER > apple-app-site-association
```

Signed `apple-app-site-association` file you now should upload to your server.

##### Step 4

Just upload that file in the root of your domain. One important thing: it should be downloadable from the direct link. For example, `https://firsthost.com/apple-app-site-association`.

**No redirects!** When application is launched - it downloads it from that link, so if it can't find it - Universal Links are not gonna work.

That's it, you have finished configuring iOS for UL support.

### Testing UL for Android locally

To test Android application for Deep Linking support you just need to execute the following command in the console:

```sh
adb shell am start
        -W -a android.intent.action.VIEW
        -d <URI> <PACKAGE>
```

where
- `<URI>` - url that you want to test;
- `<PACKAGE>` - your application's package name.

**Note:** if you didn't configure your website for UL support - then most likely after executing `adb` command you will see chooser dialog with multiple applications (at least browser and your test app). This happens because you are trying to view web content, and this can be handled by several applications. Just choose your app and proceed. If you configured your website as [described above](#configuring-for-android) - then no dialog is shown and your application will be launched directly.

Let's create new application to play with:
1. Create new Cordova project and add Android platform to it:

  ```sh
  cordova create TestAndroidApp com.example.ul TestAndroidApp
  cd ./TestAndroidApp
  cordova platform add android
  ```

2. Add UL plugin:

  ```sh
  cordova plugin add cordova-universal-links-plugin
  ```

3. Add `<universal-links>` preference into `config.xml` (`TestAndroidApp/config.xml`):

  ```xml
  <!-- some other data from config.xml -->
  <universal-links>
   <host name="myhost.com" />
  </universal-links>
  ```

4. Build and run the app:

  ```sh
  cordova run android
  ```

5. Close your application and return to console.
6. Enter in console:

  ```sh
  adb shell am start -W -a android.intent.action.VIEW -d "http://myhost.com/any/path" com.example.ul
  ```

  As a result, your application will be launched and you will see in console:

  ```
  Starting: Intent { act=android.intent.action.VIEW dat=http://myhost.com/any/path pkg=com.example.ul }
  Status: ok
  Activity: com.example.ul/.MainActivity
  ThisTime: 52
  TotalTime: 52
  Complete
  ```

  If you'll try to use host (or path), that is not defined in `config.xml` - you'll get a following error:

  ```
  Starting: Intent { act=android.intent.action.VIEW dat=http://anotherhost.com/path pkg=com.example.ul }
  Error: Activity not started, unable to resolve Intent { act=android.intent.action.VIEW dat=http://anotherhost.com/path flg=0x10000000 pkg=com.example.ul }
  ```

This way you can experiment with your Android application and check how it corresponds to different links.

### Testing iOS application



### Links for additional documentation
Android:
- [Enable Deep Linking on Android](https://developer.android.com/training/app-indexing/deep-linking.html)
- [Specifying App Content for Indexing](https://developer.android.com/training/app-indexing/enabling-app-indexing.html)
- [Video tutorial on Android App Indexing](https://realm.io/news/juan-gomez-android-app-indexing/)

iOS:
- [Apple documentation on Universal Links](https://developer.apple.com/library/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html)
- [Apple documentation on apple-app-site-association file](https://developer.apple.com/library/ios/documentation/Security/Reference/SharedWebCredentialsRef/index.html)
- [How to setup universal links on iOS 9](https://blog.branch.io/how-to-setup-universal-links-to-deep-link-on-apple-ios-9)
- [Branch.io documentation on universal links](https://dev.branch.io/recipes/branch_universal_links/#enable-universal-links-on-the-branch-dashboard)
