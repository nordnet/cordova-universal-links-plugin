# Change Log

## 1.2.1 (2016-10-23)

**Bug fixes:**

- [Issue #79](https://github.com/nordnet/cordova-universal-links-plugin/issues/79). Fixed installation error: header files were added to the compile section of the project.
- [Issue #77](https://github.com/nordnet/cordova-universal-links-plugin/issues/77). Fixed `before_prepare` hook for iOS that crashed on several systems. Thanks to [@lunchbag](https://github.com/lunchbag) for providing a fix.

**Enhancements:**

- [Issue #93](https://github.com/nordnet/cordova-universal-links-plugin/issues/93). Fixed iOS build warnings.

## 1.2.0 (2016-07-27)

**Enhancements:**

- [Merged pull request #56](https://github.com/nordnet/cordova-universal-links-plugin/pull/56). Adds support for wildcard domains. Thanks to [@schmidt](https://github.com/schmidt) for implementation.

**Docs:**

- [Merged pull request #67](https://github.com/nordnet/cordova-universal-links-plugin/pull/67). Added `Prevent Android from creating multiple app instances` section. Thanks to [@yernandus](https://github.com/yernandus).
- [Merged pull request #70](https://github.com/nordnet/cordova-universal-links-plugin/pull/70). Added `Digital Asset Links support` section. Thanks to [@ghybs](https://github.com/ghybs).

## 1.1.2 (2016-04-27)

**Bug fixes:**

- [Issue #27](https://github.com/nordnet/cordova-universal-links-plugin/issues/27). From now on dependency packages will be installed in the plugin's folder instead of the project's root folder.

## 1.1.1 (2016-03-17)

**Bug fixes:**

- [Issue #52](https://github.com/nordnet/cordova-universal-links-plugin/issues/52). Fixed `config.xml` file preferences reading. Thanks to [@ikostic](https://github.com/ikostic) for providing fix.
- [Issue #47](https://github.com/nordnet/cordova-universal-links-plugin/issues/47). If `paths` in `apple-app-site-association` file contains only `*` - we will also add `/`, so that app would be opened from root domain.
- Merged [PR #42](https://github.com/nordnet/cordova-universal-links-plugin/pull/42). Fixed Android web integration on Android 6.0. Thanks to [@mohamed-ahmed](https://github.com/mohamed-ahmed).

**Docs:**

- Merged [PR #50](https://github.com/nordnet/cordova-universal-links-plugin/pull/50). Fixed typo in documentation. Thanks to [@rafaellop](https://github.com/rafaellop).
- Merged [PR #43](https://github.com/nordnet/cordova-universal-links-plugin/pull/43). Updated documentation regarding `apple-app-site-association` file. Thanks to [@Chun-Yang](https://github.com/Chun-Yang).
- Updated `Useful notes on Universal Links for iOS` section. Thanks to [@conor-mac-aoidh](https://github.com/conor-mac-aoidh) for providing information.

## 1.1.0 (2015-12-18)

**Bug fixes:**

- [Issue #26](https://github.com/nordnet/cordova-universal-links-plugin/issues/26). Fixed support for multiple wildcards in path. Thanks to [@tdelmas](https://github.com/tdelmas) for helping with solution.
- Other minor bug fixes.

**Enhancements:**

- [Issue #18](https://github.com/nordnet/cordova-universal-links-plugin/issues/18). Added JS module through which you can subscribe for launch events. Solves timing issue with the previous `document.addEventListener()` approach.
- [Issue #20](https://github.com/nordnet/cordova-universal-links-plugin/issues/20). Lowered min iOS version to 8.0. Plugin want work on devices prior to iOS 9, but if your application includes this plugin - it now will run on iOS 8 devices. Before you had to drop iOS 8 support.
- [Issue #22](https://github.com/nordnet/cordova-universal-links-plugin/issues/22). Plugin now compatible with Cordova v5.4.
- [Issue #24](https://github.com/nordnet/cordova-universal-links-plugin/issues/24). Now you can define iOS Team ID as plugin preference. It will be used for generation of `apple-app-site-association` files.
- [Issue #25](https://github.com/nordnet/cordova-universal-links-plugin/issues/25). Plugin now compatible with Cordova iOS platform v4.0.0.

**Docs:**

- Added `Migrating from previous versions` section.
- Updated `Cordova config preferences` section.
- Updated `Application launch handling` section.
- Other minor changes because of new release.

## 1.0.1 (2015-10-23)

**Bug fixes:**

- Android. Fixed [issue #9](https://github.com/nordnet/cordova-universal-links-plugin/issues/9). Now when application is resumed from the link click - appropriate event is dispatched to the JavaScript side.

**Enhancements:**

- iOS. [Issue #6](https://github.com/nordnet/cordova-universal-links-plugin/issues/6). Scheme is now removed from the url matching process, since it is not needed: only hostname and path are used.
- Merged [pull request #1](https://github.com/nordnet/cordova-universal-links-plugin/pull/1). Now dependency npm packages are taken from the package.json file. Thanks to [@dpa99c](https://github.com/dpa99c).

**Docs:**

- Added `Useful notes on Universal Links for iOS` section.
- Updated `Android web integration` section. Added more information about web integration process.
- Added some additional links on the Android documentation.
- Fixed some broken links inside the docs.
- Added CHANGELOG.md file.
