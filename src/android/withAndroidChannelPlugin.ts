import { ExpoConfig } from 'expo/config'
import {
  ConfigPlugin,
  WarningAggregator,
  withMainApplication,
} from 'expo/config-plugins'

import { ChannelPluginProps } from '../types'

// This source code is based on https://github.com/expo/expo/blob/435bbba/packages/expo-dev-menu/plugin/src/withDevMenu.ts#L30
function addJavaImports(javaSource: string, javaImports: string[]): string {
  const lines = javaSource.split('\n')
  const lineIndexWithPackageDeclaration = lines.findIndex((line) =>
    line.match(/^package .*;$/)
  )
  for (const javaImport of javaImports) {
    if (!javaSource.includes(javaImport)) {
      const importStatement = `import ${javaImport};`
      lines.splice(lineIndexWithPackageDeclaration + 1, 0, importStatement)
    }
  }
  return lines.join('\n')
}

function modifyJavaMainActivity(contents: string) {
  contents = addJavaImports(contents, [
    'com.zoyi.channel.plugin.android.ChannelIO',
  ])

  const lines = contents.split('\n')
  const initialized = lines.some((line) =>
    line.includes('ChannelIO.initialize(this);')
  )
  if (initialized) {
    return contents
  }

  const onApplicationCreateIndex = lines.findIndex((line) =>
    line.includes('ApplicationLifecycleDispatcher.onApplicationCreate(this);')
  )

  if (onApplicationCreateIndex === -1) {
    WarningAggregator.addWarningAndroid(
      '@peulda/expo-plugin-channel-io',
      'Failed to add ChannelIO.initialize(this); to MainActivity.java. You will need to manually add it to your MainActivity.java'
    )
    return contents
  }

  lines.splice(
    onApplicationCreateIndex + 1,
    0,
    '    ChannelIO.initialize(this);'
  )
  return lines.join('\n')
}

function addKotlinImports(
  kotlinSource: string,
  kotlinImports: string[]
): string {
  const lines = kotlinSource.split('\n')
  const lineIndexWithPackageDeclaration = lines.findIndex((line) =>
    line.match(/^package .*$/)
  )
  for (const kotlinImport of kotlinImports) {
    if (!kotlinSource.includes(kotlinImport)) {
      const importStatement = `import ${kotlinImport}`
      lines.splice(lineIndexWithPackageDeclaration + 1, 0, importStatement)
    }
  }
  return lines.join('\n')
}

function modifyKotlinMainActivity(contents: string) {
  contents = addKotlinImports(contents, [
    'com.zoyi.channel.plugin.android.ChannelIO',
  ])

  const lines = contents.split('\n')
  const initialized = lines.some((line) =>
    line.includes('ChannelIO.initialize(this)')
  )
  if (initialized) {
    return contents
  }

  const onApplicationCreateIndex = lines.findIndex((line) =>
    line.includes('ApplicationLifecycleDispatcher.onApplicationCreate(this)')
  )

  if (onApplicationCreateIndex === -1) {
    WarningAggregator.addWarningAndroid(
      '@peulda/expo-plugin-channel-io',
      'Failed to add ChannelIO.initialize(this) to MainActivity.kt. You will need to manually add it to your MainActivity.kt'
    )
    return contents
  }

  lines.splice(
    onApplicationCreateIndex + 1,
    0,
    '    ChannelIO.initialize(this)'
  )
  return lines.join('\n')
}

export const withAndroidChannelPlugin: ConfigPlugin<ChannelPluginProps> = (
  config: ExpoConfig
) => {
  return withMainApplication(config, (config) => {
    if (config.modResults.language === 'java') {
      config.modResults.contents = modifyJavaMainActivity(
        config.modResults.contents
      )
    } else {
      config.modResults.contents = modifyKotlinMainActivity(
        config.modResults.contents
      )
    }
    return config
  })
}
