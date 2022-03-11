import { AppRegistry } from 'react-native'
import 'node-libs-react-native/globals'
import './shim.js'
import 'react-native-get-random-values'
import './polyfill'
import App from './src/App'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => App)
