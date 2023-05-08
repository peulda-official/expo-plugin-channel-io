# @peulda/expo-plugin-channel-io

Expo plugin for channel.io. Tested on Expo SDK 48.

This plugin help [setup `ChannelIOSDK` podspecs, `AppDelegate.{m,mm}` and MainApplication.java](https://developers.channel.io/docs/react-native-quickstart).

# Installation
This plugin has peer dependencies. So, you need to install `react-native-channel-plugin` and `expo` first.

```sh
npm install @peulda/expo-plugin-channel-io react-native-channel-plugin
```

# Usage
```json
// app.json
{
  "expo": {
    "plugins": [
      "@peulda/expo-plugin-channel-io"
    ]
  }
}
```

```js
import { useEffect } from 'react'
import { View, Text } from 'react-native'
import { ChannelIO } from 'react-native-channel-plugin'

export function App() {
  useEffect(() => {
    ChannelIO
      .boot({ pluginKey: 'YOUR_PLUGIN_KEY' })
      .then(() => ChannelIO.showMessenger())
  }, [])

  return (
    <View >
      <Text>Hello World</Text>
    </View>
  )
}
```
That's it! 😉

# Options
This plugin has some options. You can set options in `app.json` like this:

## podVersion (iOS only)
**Default: `latest`**

By default, this plugin sets the `ChannelIOSDK` podspec to:
```ruby
pod 'ChannelIOSDK', podspec: 'https://mobile-static.channel.io/ios/latest/xcframework.podspec'
```

If you need to install a specific package version, you can set the version in `podVersion` option.

```json
{
  "expo": {
    "plugins": [
      ["@peulda/expo-plugin-channel-io", {
        "podVersion": "10.3.0"
      }]
    ]
  }
}
```
It will set the `ChannelIOSDK` podspec to:
```ruby
pod 'ChannelIOSDK', podspec: 'https://mobile-static.channel.io/ios/10.3.0/xcframework.podspec'
```

## Permissions (iOS only)
Channel plugin required [some permissions](https://developers.channel.io/docs/react-native-quickstart#2-add-the-permission-and-description-used-by-sdk). By default, this plugin sets these permissions with following values:

| Key | Value |
| --- | --- |
| `NSCameraUsageDescription` | `Accessing the camera in order to provide a better user experience` |
| `NSPhotoLibraryUsageDescription` | `Accessing to photo library in order to provide a better user experience` |
| `NSMicrophoneUsageDescription` | `Accessing to microphone to record voice for video chat` |

If you already set these permissions via `infoPlist` or other plugins then, This plugin use your values.

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "foo",
        "NSPhotoLibraryUsageDescription": "bar",
        "NSMicrophoneUsageDescription": "baz"
      }
    },
    "plugins": [
      // Permission popup will show with `foo`, `bar`, `baz`
      "@peulda/expo-plugin-channel-io"
    ]
  }
}
```

If you set `permissions` option, This plugin override these permissions with plugin values.

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "foo",
        "NSPhotoLibraryUsageDescription": "bar",
        "NSMicrophoneUsageDescription": "baz"
      }
    },
    "plugins": [
      ["@peulda/expo-plugin-channel-io", {
        "permissions": {
          // Permission popup will show with `camera`, `photos`, `microphone`
          "cameraPermission": "camera",
          "photosPermission": "photos",
          "microphonePermission": "microphone"
        }
      }]
    ]
  }
}
```

If you want disable those permissions, you can set value to `false`.

```json
{
  "expo": {
    "plugins": [
      ["@peulda/expo-plugin-channel-io", {
        "cameraPermission": false,
        "photosPermission": false,
        "microphonePermission": false
      }]
    ]
  }
}
```

# Notice
- Since expo SDK 48, default android minSdkVersion is 21. So [MultiDex is enabled by default](https://developer.android.com/studio/build/multidex#mdex-on-l). For this reason, this plugin does not support android minSdkVersion 20 or lower.
- Since expo SDK 48, default SWIFT_VERSION is 5.0. So, this plugin does not set `SWIFT_VERSION`
- Since expo SDK 48, default iOS minTarget is 13. So, this plugin does not set `Privacy - Photo Library Usage Description`
