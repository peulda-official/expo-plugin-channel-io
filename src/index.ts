import { ExpoConfig } from 'expo/config'
import { ConfigPlugin, withPlugins } from 'expo/config-plugins'

import { withAndroidChannelPlugin } from './android/withAndroidChannelPlugin'
import { withChannelAppDelegate } from './ios/withChannelAppDelegate'
import { withChannelInfoPlist } from './ios/withChannelInfoPlist'
import { withChannelPodPlugin } from './ios/withChannelPodPlugin'
import { ChannelPluginProps } from './types'

const withIosChannelPlugin: ConfigPlugin<ChannelPluginProps> = (
  config: ExpoConfig,
  props: ChannelPluginProps
) => {
  return withPlugins(config, [
    [withChannelPodPlugin, props],
    withChannelAppDelegate,
    [withChannelInfoPlist, props],
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
