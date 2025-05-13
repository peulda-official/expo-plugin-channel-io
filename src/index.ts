import { ExpoConfig } from 'expo/config'
import { ConfigPlugin, withPlugins } from 'expo/config-plugins'

import { withChannelBuildGradle } from './android/withChannelBuildGradle'
import { withChannelMainApplication } from './android/withChannelMainApplication'
import { withChannelAppDelegate } from './ios/withChannelAppDelegate'
import { withChannelInfoPlist } from './ios/withChannelInfoPlist'
import { ChannelPluginProps } from './types'

const withIosChannelPlugin: ConfigPlugin<ChannelPluginProps> = (
  config: ExpoConfig,
  props: ChannelPluginProps
) => {
  return withPlugins(config, [
    withChannelAppDelegate,
    [withChannelInfoPlist, props],
  ])
}

const withAndroidChannelPlugin: ConfigPlugin<ChannelPluginProps> = (
  config: ExpoConfig,
  props: ChannelPluginProps
) => {
  return withPlugins(config, [
    [withChannelBuildGradle, props],
    [withChannelMainApplication, props],
  ])
}

const withChannelPlugin: ConfigPlugin<ChannelPluginProps> = (
  config: ExpoConfig,
  props: ChannelPluginProps = {}
) => {
  return withPlugins(config, [
    [withIosChannelPlugin, props],
    [withAndroidChannelPlugin, props],
  ])
}

export type { ChannelPluginProps }
export default withChannelPlugin
