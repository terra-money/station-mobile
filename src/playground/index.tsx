import {
  Button,
  FormControl,
  HStack,
  Input,
  Text,
  View,
  WarningOutlineIcon,
} from 'native-base'
import React from 'react'
import { Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const PlaygroundScreen = () => {
  return (
    <SafeAreaView>
      <View bg="background.400" p={5}>
        <Text variant="subtitle" mt={6} mb={4}>
          Net Worth
        </Text>
        <Text variant="display" mb={3}>
          $12,345.67
        </Text>
        <Text variant="body2">$1,234.56 available</Text>

        <HStack mt={6} space={3} justifyContent="center">
          <Button
            flex={1}
            variant="normal"
            onPress={() => Alert.alert('pressed!')}>
            Send
          </Button>
          <Button
            flex={1}
            variant="primary"
            onPress={() => Alert.alert('pressed!')}>
            Receive
          </Button>
        </HStack>
      </View>

      <View p={5}>
        <FormControl>
          <FormControl.Label>Address</FormControl.Label>
          <Input placeholder="Enter your address" variant="outline" />
        </FormControl>

        <FormControl isInvalid>
          <FormControl.Label>Password</FormControl.Label>
          <Input placeholder="Current password" variant="outline" />
          <FormControl.ErrorMessage
            leftIcon={<WarningOutlineIcon size="xs" />}>
            Try different from previous passwords.
          </FormControl.ErrorMessage>
        </FormControl>
      </View>
    </SafeAreaView>
  )
}

export default PlaygroundScreen
