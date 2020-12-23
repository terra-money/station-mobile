import { AppRegistry } from 'react-native'
import 'node-libs-react-native/globals'
import App from './App'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => App)
