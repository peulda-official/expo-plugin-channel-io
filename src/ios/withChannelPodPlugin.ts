import { ExpoConfig } from 'expo/config'
import {
  ConfigPlugin,
  WarningAggregator,
  withDangerousMod,
} from 'expo/config-plugins'
import * as fs from 'fs'
import * as path from 'path'

import { ChannelPluginProps } from '../types'

const POD_SPEC_REGEX =
  /pod 'ChannelIOSDK', podspec: 'https:\/\/mobile-static\.channel\.io\/ios\/(latest|\d+.\d+.\d+)\/xcframework\.podspec'/

function modifyPodfile(contents: string, version: string) {
  const podspec = `https://mobile-static.channel.io/ios/${version}/xcframework.podspec`
  const pod = `pod 'ChannelIOSDK', podspec: '${podspec}'`
  const lines = contents.split('\n')
  const matched = lines.find((line) => POD_SPEC_REGEX.test(line))
  if (matched) {
    if (matched.trim() === pod) {
      return contents
    }
    return contents.replace(POD_SPEC_REGEX, pod)
  }

  const index = lines.findIndex((line) =>
    line.includes('post_install do |installer|')
  )
  if (index > -1) {
    lines.splice(index, 0, '  ' + pod)
  } else {
    WarningAggregator.addWarningIOS(
      '@peulda/expo-plugin-channel-io',
      'Failed to add ChannelIOSDK pod. You will need to manually add it to your Podfile'
    )
  }

  return lines.join('\n')
}

export const withChannelPodPlugin: ConfigPlugin<ChannelPluginProps> = (
  config: ExpoConfig,
  { podVersion = 'latest' }: ChannelPluginProps
) =>
  withDangerousMod(config, [
    'ios',
    async (config) => {
      const podFilePath = path.join(
        config.modRequest.platformProjectRoot,
        'Podfile'
      )
      const content = await fs.promises.readFile(podFilePath, 'utf8')
      const newContent = modifyPodfile(content, podVersion)
      await fs.promises.writeFile(podFilePath, newContent)
      return config
    },
  ])
