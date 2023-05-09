import { useState } from 'react'
import { Button, StyleSheet, TextInput, View } from 'react-native'
import { ChannelIO } from 'react-native-channel-plugin'

export default function App() {
  const [pluginKey, setPluginKey] = useState('')

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setPluginKey}
        value={pluginKey}
        placeholder="Please enter your plugin key"
      />
      <Button
        title="Boot Channel"
        onPress={async () => {
          await ChannelIO.boot({
            pluginKey,
          })
          ChannelIO.showChannelButton()
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
})
