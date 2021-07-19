import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { StackActions, useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import Body from 'components/layout/Body'
import { Text, Icon, Button } from 'components'
import { RootStackParams } from 'types'
import color from 'styles/color'

type Props = StackScreenProps<RootStackParams, 'Complete'>

const Complete = ({ route }: Props): ReactElement => {
  const { goBack, canGoBack, dispatch } = useNavigation()

  const onPressGoBack = (): void => {
    if (canGoBack()) {
      goBack()
    } else {
      dispatch(StackActions.replace('Tabs'))
    }
  }
  const card = route.params.result
  return (
    <Body>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Icon
          size={60}
          color={color.sapphire}
          name={'check-circle-outline'}
        />
        <Text
          style={{ fontSize: 24, marginVertical: 5 }}
          fontType={'bold'}
        >
          {card.title}
        </Text>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            textAlign: 'center',
          }}
        >
          {card.content}
        </Text>
      </View>
      <Button
        theme={'sapphire'}
        title={card.button || 'OK'}
        onPress={onPressGoBack}
        containerStyle={{ marginBottom: 40 }}
      />
    </Body>
  )
}

export default Complete
