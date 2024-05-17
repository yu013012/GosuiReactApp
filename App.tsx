
import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// screen
import { Login } from './screens/login'
import { Home } from './screens/home'
import Sensor from './screens/sensor'

// navigation
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 状態管理用context
import { MyContextProvider } from './contexts/MyContextProvider';

// navigation定義
const Stack = createStackNavigator();

//function App(): JSX.Element {
const App = () => {
  return (
      <MyContextProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="login"
              component={Login}
              options={{
                title: '午睡チェック', // ヘッダーに表示するタイトル
                headerStyle: {
                  backgroundColor: '#1fa19b', // ヘッダーの背景色
                },
                gestureEnabled: false,
                headerTintColor: 'white', // ヘッダーのテキスト色
                headerTitleStyle: {
                  fontWeight: 'bold', // ヘッダータイトルのスタイル
                },
                headerLeft: () => null, // バックボタンを非表示にする
              }}
            />
            <Stack.Screen
              name="home"
              component={Home}
              options={{
                title: '午睡チェック', // ヘッダーに表示するタイトル
                headerStyle: {
                  backgroundColor: '#1fa19b', // ヘッダーの背景色
                },
                gestureEnabled: false,
                headerTintColor: 'white', // ヘッダーのテキスト色
                headerTitleStyle: {
                  fontWeight: 'bold', // ヘッダータイトルのスタイル
                },
                headerLeft: () => null, // バックボタンを非表示にする
              }}
            />
            <Stack.Screen
              name="sensor"
              component={Sensor}
              options={{
                title: '午睡チェック', // ヘッダーに表示するタイトル
                headerStyle: {
                  backgroundColor: '#1fa19b', // ヘッダーの背景色
                },
                gestureEnabled: false,
                headerTintColor: 'white', // ヘッダーのテキスト色
                headerTitleStyle: {
                  fontWeight: 'bold', // ヘッダータイトルのスタイル
                },
                headerLeft: () => null, // バックボタンを非表示にする
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </MyContextProvider>
  );
}

export default App;
