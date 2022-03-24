fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## Android
### android test
```
fastlane android test
```
Runs all the tests
### android bump_build_number
```
fastlane android bump_build_number
```
Increments internal build number tracking (different than version)
### android beta
```
fastlane android beta
```
Submit a new Beta Build to Crashlytics Beta
### android deploy
```
fastlane android deploy
```
Deploy a new version to the Google Play
### android buildReleaseAPK
```
fastlane android buildReleaseAPK
```
Archive build Ad Hoc
### android uploadFirebaseDev
```
fastlane android uploadFirebaseDev
```
upload to Beta by FireBase
### android uploadAPK
```
fastlane android uploadAPK
```
Push a new build to Fabric and FireBase App Distribution
### android playstoreInternal
```
fastlane android playstoreInternal
```
Build and uploads the app to playstore for a internal testing release

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
