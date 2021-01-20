import React, { ReactElement } from 'react'
import { View } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import Button from 'components/Button'
import Text from 'components/Text'
import Body from 'components/layout/Body'
import { RootStackParams } from 'types'
import color from 'styles/color'

type Props = StackScreenProps<RootStackParams, 'Complete'>

const Complete = ({ route }: Props): ReactElement => {
  const { goBack } = useNavigation()
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
        <MaterialIcons
          size={60}
          color={color.sapphire}
          name={'check-circle-outline'}
        />
        <Text style={{ fontSize: 24 }} fontType={'bold'}>
          {card.title}
        </Text>
        <Text style={{ fontSize: 16 }}>{card.content}</Text>
      </View>
      <Button
        theme={'blue'}
        title={card.button || 'OK'}
        onPress={goBack}
        containerStyle={{ marginBottom: 40 }}
      />
    </Body>
  )
}

export default Complete
