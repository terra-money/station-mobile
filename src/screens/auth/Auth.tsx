import React from 'react'
import { AuthStack } from '../../types/navigation'
import AuthMenu from './AuthMenu'
import Select from './Select'
import New from './New'
import Add from './Add'

const Auth = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="AuthMenu" component={AuthMenu} />
    <AuthStack.Screen name="Select" component={Select} />
    <AuthStack.Screen name="New" component={New} />
    <AuthStack.Screen name="Add" component={Add} />
  </AuthStack.Navigator>
)

export default Auth
