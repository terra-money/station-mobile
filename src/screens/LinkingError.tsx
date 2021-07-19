import React, { ReactElement, useState } from 'react'

import { RootStackParams } from 'types/navigation'
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native'
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'

import { Button, Icon, Text } from 'components'
import Body from 'components/layout/Body'
import color from 'styles/color'
import images from 'assets/images'
import { navigationHeaderOptions } from 'components/layout/Header'

type Props = StackScreenProps<RootStackParams, 'LinkingError'>

const Details = ({
  errorMessage,
}: {
  errorMessage: string
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <View style={styles.openBox}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            borderRadius: 5,
            backgroundColor: color.red,
            paddingHorizontal: 5,
          }}
        >
          <Text style={styles.executeContract} fontType="bold">
            Details
          </Text>
        </View>
        <TouchableOpacity
          style={styles.openBtn}
          onPress={(): void => {
            setIsOpen(!isOpen)
          }}
        >
          <Text
            style={{ color: color.dodgerBlue, fontSize: 10 }}
            fontType="bold"
          >
            {isOpen ? 'Collapse' : 'Expand'}
          </Text>
          <Icon
            name={isOpen ? 'expand-less' : 'expand-more'}
            size={14}
            color={color.dodgerBlue}
          />
        </TouchableOpacity>
      </View>
      {isOpen && (
        <View style={{ paddingTop: 15 }}>
          <Text>{errorMessage}</Text>
        </View>
      )}
    </View>
  )
}
const LinkingError = ({ route }: Props): ReactElement => {
  const errorMessage = route.params?.errorMessage
  const { goBack, dispatch, canGoBack } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  const goBackOrHome = (): void => {
    if (canGoBack()) {
      goBack()
    } else {
      dispatch(StackActions.replace('Tabs'))
    }
  }

  return (
    <Body
      containerStyle={{
        paddingBottom: 50,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ alignItems: 'center', paddingTop: 40 }}>
        <Image
          source={images.oops_face}
          style={{ width: 60, height: 60 }}
        />
        <Text style={styles.errorTitle} fontType="bold">
          Oops! Something went wrong
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontStyle: 'normal',
            lineHeight: 24,
            letterSpacing: 0,
            textAlign: 'center',
          }}
        >
          {
            'Access requested with an invalid address.\nPlease contact the service provider.'
          }
        </Text>
        {errorMessage && <Details errorMessage={errorMessage} />}
      </View>
      <Button
        theme="sapphire"
        onPress={goBackOrHome}
        title="Go Back"
      />
    </Body>
  )
}

LinkingError.navigationOptions = navigationHeaderOptions({
  theme: 'white',
  goBackIconType: 'close',
})

export default LinkingError

const styles = StyleSheet.create({
  openBox: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginTop: 50,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ebeff8',
  },
  executeContract: {
    fontSize: 12,
    fontStyle: 'normal',
    lineHeight: 21,
    letterSpacing: 0,
    color: '#ffffff',
  },
  openBtn: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: color.dodgerBlue,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 20,
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: 'center',
  },
})
