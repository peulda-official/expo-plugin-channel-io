import { ExpoConfig } from 'expo/config'
import {
  ConfigPlugin,
  WarningAggregator,
  withProjectBuildGradle,
} from 'expo/config-plugins'

import { ChannelPluginProps } from '../types'

function modifyBuildGradle(contents: string) {
  if (contents.includes('https://maven.channel.io/maven2')) {
    return contents
  }
  const lines = contents.split('\n')
  let inBuildscript = false
  let inRepositories = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^buildscript {/.test(line)) {
      // buildscript block
      inBuildscript = true
    } else if (inBuildscript && /^\s*repositories {/.test(line)) {
      // repositories block
      inRepositories = true
    } else if (inRepositories && line.includes('mavenCentral()')) {
      const indentMatch = line.match(/^(\s*)/)
      const indent = indentMatch ? indentMatch[1] : ''
      const entryLines = [
        `${indent}maven {`,
        `${indent}    url 'https://maven.channel.io/maven2'`,
        `${indent}    name 'ChannelTalk'`,
        `${indent}}`,
      ]
      // insert after mavenCentral()
      lines.splice(i + 1, 0, ...entryLines)
      return lines.join('\n')
    } else if (inBuildscript && /^}$/.test(line)) {
      // end of buildscript block
      inBuildscript = false
      inRepositories = false
    }
  }
  WarningAggregator.addWarningAndroid(
    '@peulda/expo-plugin-channel-io',
    'Failed to add ChannelTalk Maven repository. You will need to manually add it to your build.gradle'
  )
  return contents
}

export const withChannelBuildGradle: ConfigPlugin<ChannelPluginProps> = (
  config: ExpoConfig
) => {
  return withProjectBuildGradle(config, (project) => {
    project.modResults.contents = modifyBuildGradle(project.modResults.contents)
    return project
  })
}
