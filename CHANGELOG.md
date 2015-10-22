# Change Log

## 1.0.1 (2015-23-10)

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
