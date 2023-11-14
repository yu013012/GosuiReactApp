/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { PanGestureHandler } from 'react-native-gesture-handler';

AppRegistry.registerComponent(appName, () => App);
