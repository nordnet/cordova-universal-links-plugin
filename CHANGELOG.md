# Change Log

## 1.1.0 (2015-12-18)

**Bug fixes:**

- [Issue #26](https://github.com/nordnet/cordova-universal-links-plugin/issues/26). Fixed support for multiple wildcards in path. Thanks to [@tdelmas](https://github.com/tdelmas) for helping with solution.
- Other minor bug fixes.

**Enchancements:**

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

**Enchancements:**

- iOS. [Issue #6](https://github.com/nordnet/cordova-universal-links-plugin/issues/6). Scheme is now removed from the url matching process, since it is not needed: only hostname and path are used.
- Merged [pull request #1](https://github.com/nordnet/cordova-universal-links-plugin/pull/1). Now dependency npm packages are taken from the package.json file. Thanks to [@dpa99c](https://github.com/dpa99c).

**Docs:**

- Added `Useful notes on Universal Links for iOS` section.
- Updated `Android web integration` section. Added more information about web integration process.
- Added some additional links on the Android documentation.
- Fixed some broken links inside the docs.
- Added CHANGELOG.md file.
