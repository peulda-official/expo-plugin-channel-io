import { ExpoConfig } from 'expo/config'
import { WarningAggregator, withAppDelegate } from 'expo/config-plugins'

function modifyObjcAppDelegate(contents: string): string {
  if (!contents.includes('#import <ChannelIOFront/ChannelIOFront-swift.h>')) {
    contents = contents.replace(
      /#import "AppDelegate.h"/g,
      `#import "AppDelegate.h"
#import <ChannelIOFront/ChannelIOFront-swift.h>`
    )
  }

  if (contents.includes('[ChannelIO initialize:application];')) {
    return contents
  }

  const lines = contents.split('\n')
  const didFinishLaunchingWithOptionsIndex = lines.findIndex((line) =>
    line.includes(
      '[super application:application didFinishLaunchingWithOptions:'
    )
  )
  if (didFinishLaunchingWithOptionsIndex === -1) {
    WarningAggregator.addWarningIOS(
      '@peulda/expo-plugin-channel-io',
      'Failed to initialize ChannelIO. You will need to manually initialize it in AppDelegate.m'
    )
    return contents
  }

  lines.splice(
    didFinishLaunchingWithOptionsIndex,
    0,
    '  [ChannelIO initialize:application];'
  )
  return lines.join('\n')
}

export const withChannelAppDelegate = (config: ExpoConfig) => {
  return withAppDelegate(config, (config) => {
    if (['objc', 'objcpp'].includes(config.modResults.language)) {
      config.modResults.contents = modifyObjcAppDelegate(
        config.modResults.contents
      )
    } else {
      WarningAggregator.addWarningIOS(
        '@peulda/expo-plugin-channel-io',
        `Swift AppDelegate files are not supported yet.
See the expo-dev-client installation instructions to modify your AppDelegate manually: https://developers.channel.io`
      )
    }
    return config
  })
}
