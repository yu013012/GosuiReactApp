import React from 'react'
import {
  StyleSheet, View, Text, Button, TextInput, TouchableOpacity, ScrollView, ImageBackground, KeyboardAvoidingView, Dimensions, PermissionsAndroid, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../components/input_text_component'
import constants from '../helper/constants'
import Api from '../helper/api'
import { check, request } from 'react-native-permissions';
import { Alert } from '../components/alert_component';

const screenHeight = Dimensions.get('window').height;

type Params = {
  ACT: string,
  ID: string,
  PASS: string,
}
// ()はリターンがいらないけど、{}はいる
export const Login = (props: {navigation: any}) => {
  const {navigation} = props
  const [id, setId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [visible, setVisible] = React.useState(false);

  const handleIdChange = (newText: string) => {
    setId(newText);
  };

  const handlePasswordChange = (newText: string) => {
    setPassword(newText);
  };

  const autoLogin = async () => {
    try {
      const tno = await AsyncStorage.getItem('tno');
      if (tno) {
        navigation.navigate('home');
      }
    } catch (error) {
      console.error('Error fetching tno:', error);
    }
  }

  React.useEffect(() => {
    const bluetooth1 = async () => {
      await check('android.permission.BLUETOOTH_SCAN')
      .then((result) => {
        switch (result) {
          case 'granted':
            console.log("ok")
            bluetooth2()
            break;
          case 'denied':
            // 位置情報の権限が拒否されている場合の処理
            console.log("no")
            request('android.permission.BLUETOOTH_SCAN')
              .then((newResult) => {
                if (newResult === 'granted') {
                  console.log("okを押した")
                  bluetooth2()
                } else {
                  console.log("noを押した")
                  setVisible(true)
                }
              });
            break;
          default:
            console.log("no")
            setVisible(true)
            break;
        }
      });
    }

    // Blueの権限はBLUETOOTH_CONNECTとBLUETOOTH_SCANが必要みたい。この二つの一つでもかけていたら検索ができない。
    const bluetooth2 = async () => {
      await check('android.permission.BLUETOOTH_CONNECT')
      .then((result) => {
        switch (result) {
          case 'granted':
            console.log("ok")
            location()
            break;
          case 'denied':
            // 位置情報の権限が拒否されている場合の処理
            console.log("no")
            request('android.permission.BLUETOOTH_CONNECT')
              .then((newResult) => {
                if (newResult === 'granted') {
                  console.log("okを押した")
                  location()
                } else {
                  console.log("noを押した")
                  setVisible(true)
                }
              });
            break;
          default:
            console.log("no")
            setVisible(true)
            break;
        }
      });
    }

    const location = async () => {
      check('android.permission.ACCESS_FINE_LOCATION')
      .then((result) => {
        switch (result) {
          case 'granted':
            console.log("ok")
            autoLogin();
            break;
          case 'denied':
            // 位置情報の権限が拒否されている場合の処理
            console.log("no")
            request('android.permission.ACCESS_FINE_LOCATION')
              .then((newResult) => {
                if (newResult === 'granted') {
                  console.log("okを押した")
                  autoLogin();
                } else {
                  console.log("noを押した")
                  setVisible(true)
                }
              });
            break;
          default:
            console.log("no");
            setVisible(true)
            break;
        }
      });
    }

    if (Platform.OS === 'android') {
      bluetooth1()
    } else {
      autoLogin();
    }
  }, []);

  const login = async () => {
    const params: Params = {
      ACT: 'CHECK_TNO',
      ID: id,
      PASS: password,
    }
    const tno: any = await Api({act: "login", params: params});
    if (tno) {
      await AsyncStorage.setItem("tno", tno);
      navigation.navigate('home');
    }
  }

  // MEMO classの場合render{}
  // viewの中でImageBackgroundをやらないとkeyboardが出たりしたらリサイズされてしまう
  return (
      <View>
        <ScrollView>
          <Alert visible={visible} text="位置情報、bluetoothの権限が許可されていません。許可したうえで再度アプリを起動してください。" />
          <ImageBackground
            source={require('../assets/login.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.container}>
              <Text style={styles.title}>{constants.title}</Text>
              <Input
                placeholder_={constants.placeholder_id}
                handleChange_={handleIdChange}
                value_={`${id}`}
                secureTextEntry_={false}
                id_="login"
              />
              <Input
                placeholder_={constants.placeholder_password}
                handleChange_={handlePasswordChange}
                value_={`${password}`}
                secureTextEntry_={true}
                id_="password"
              />
              <TouchableOpacity style={[styles.login_button]} onPress={login}>
                <Text style={{color: 'white', fontSize: 20}}>{constants.login}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </ScrollView>
      </View>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start', // 上端揃え
    alignItems: 'center', // 要素
    paddingHorizontal: 20, // 左右の余白
    minHeight: screenHeight, // MEMO 指定しないとscrollviewの場合画像がいっぱいに表示されない
  },
  title: {
    color: 'white', // 文字色を黒に設定
    fontSize: 24,
    marginTop: 100,
    marginBottom: 100,
    fontWeight: 'bold',
  },
  login_button: {
    color: 'white', // 文字色を黒に設定
    padding: 20, // 内部の余白を設定（任意）
    width: '100%', // 横幅
    margin: 100, // 要素外の余白
    alignItems: 'center',
    backgroundColor: 'blue',
  },
});
