import { ConfigPlugin, withInfoPlist } from 'expo/config-plugins'

import { ChannelPluginProps } from '../types'

const CAMERA_USAGE =
  'Accessing to camera in order to provide better user experience'
const READ_PHOTOS_USAGE = 'Accessing to photo library in order to save photos'
const MICROPHONE_USAGE = 'Accessing to microphone to record voice for video'

export const withChannelInfoPlist: ConfigPlugin<ChannelPluginProps> = (
  config,
  { cameraPermission, photosPermission, microphonePermission }
) => {
  return withInfoPlist(config, (config) => {
    if (cameraPermission !== false) {
      config.modResults.NSCameraUsageDescription =
        cameraPermission ||
        config.modResults.NSCameraUsageDescription ||
        config.ios?.infoPlist?.NSCameraUsageDescription ||
        CAMERA_USAGE
    }

    if (photosPermission !== false) {
      config.modResults.NSPhotoLibraryUsageDescription =
        photosPermission ||
        config.modResults.NSPhotoLibraryUsageDescription ||
        config.ios?.infoPlist?.NSPhotoLibraryUsageDescription ||
        READ_PHOTOS_USAGE
    }

    if (microphonePermission !== false) {
      config.modResults.NSMicrophoneUsageDescription =
        microphonePermission ||
        config.modResults.NSMicrophoneUsageDescription ||
        config.ios?.infoPlist?.NSMicrophoneUsageDescription ||
        MICROPHONE_USAGE
    }

    return config
  })
}
