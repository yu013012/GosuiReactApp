import React, { useEffect, useState } from 'react'
import {StyleSheet, View, Text, Button, TextInput, TouchableOpacity, ScrollView, ImageBackground, KeyboardAvoidingView, Dimensions, BackHandler } from 'react-native';
import { UserView } from '../components/user_view_component';
import { useMyContext, MyContextType } from '../contexts/MyContext';
import { Alert } from '../components/alert_component';
import {BlueStart, BlueEnd} from '../helper/bluetooth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../helper/api'
import Token from '../helper/token'
import DeviceInfo from 'react-native-device-info';
import AlertSound from '../helper/alert'

const screenHeight = Dimensions.get('window').height;

type Params = {
  [key: string]: string
}

type ApiSend = {
  [macaddress: string]: number
}

export const Home = (props: {navigation}) => {
  const {navigation} = props
  // 全体の状態管理
  const { data, setData } = useMyContext();
  // トークン用状態管理
  const [ token, setToken ] = useState<string>('');
  // 5分おきのapi実行フラグ
  const [ apiSend, setApiSend ] = useState<ApiSend>({});
  // アラート状態管理
  const [ visible, setVisible ] = useState<boolean>(false);

  BackHandler.addEventListener('hardwareBackPress', () => {return true});

  // アラート監視、5分おきAPI
  useEffect(() => {

    const alertAndApi = () => {
      let visibleCount: number = 0
      // 時間の計算、5分で割り切れればtrue
      const now = new Date();
      const minutes = now.getMinutes();
      const isFiveMinuteInterval = minutes % 5 === 0;

      // apiフラグをリセット
      if (!isFiveMinuteInterval) {
        setApiSend({})
      }

      // ()だと1文だけだからifでエラーが出ていた
      Object.keys(data).map(key => {
        // データ更新用apiを送る
        if (key !== 'visible' && isFiveMinuteInterval && apiSend[key] !== 1 && data[key].start_flg == true) {
          console.log(`${minutes}分なので${key}を更新します`)
          apiSend[key] = 1
          setApiSend(apiSend)
          UpdateApi(key)
        }

        if (key !== 'visible' && data[key].allow === "↓" && data[key].start_flg == true) {
          console.log(`アラート出します${key}`)
          visibleCount++
        }
      })

      if (visibleCount === 0) {
        setVisible(false)
      } else {
        setVisible(true)
        AlertSound()
      }
    }

    const UpdateApi = async (key: string) => {
      const date = new Date()
      const date_str: string = String(date.getFullYear())
          + String(('0' + (date.getMonth() + 1)).slice(-2))
          + String(('0' + date.getDate()).slice(-2))
          + String(('0' + date.getHours()).slice(-2))
          + String(('0' + date.getMinutes()).slice(-2))
          + String(('0' + date.getSeconds()).slice(-2));
      const tno = await AsyncStorage.getItem('tno');
      const params: Params = {
        ACT: 'UPDATE_RECORD_REACT',
        TNO: `${tno}`,
        MNO: `${data[key].mno}`,
        record_direction: `${data[key].allow}`,
        record_date: date_str,
        category_react: `${data[key].category}`,
        tantou_react: `${data[key].tantou}`,
      }
      await console.log(params)
      await Api({act: "update_data", params: params});
    }

    // タイマーをスタートしたり、allowの向きが変わるたびにここが呼ばれるのでタイマーだと呼ばれないことがあるので下記
    alertAndApi();

    // 毎秒実行
    const timer = setInterval(() => {
      alertAndApi();
    }, 1000);

    // コンポーネントがアンマウントされた場合にタイマーをクリアする
    return () => clearTimeout(timer);
  }, [data]);

  // 初期データの取得、Blueの実行
  useEffect(() => {

    const GetApi = async () => {
      //const token = await Token()
      const token_temp = await DeviceInfo.getUniqueId().then((uniqueId) => {
        setToken(uniqueId)
        return uniqueId
      });
      console.log(token_temp)
      const tno = await AsyncStorage.getItem('tno');
      const params: Params = {
        ACT: 'GET_DATA',
        TNO: `${tno}`,
        token: `${token_temp}`,
      }
      const data = await Api({act: "get_data", params: params, setData});
      console.log(data)
      BlueStart(data, setData);
    }
    GetApi()

    return () => {
      BlueEnd(data)
      BackHandler.removeEventListener('hardwareBackPress', () => {return true});
    }
  }, []);

  // 開始ボタンクリック
  const onClickStartEnd = (uuid) => {
    // blue接続していない場合は処理をスキップする
    if (data[uuid].allow === "") {
      return
    }
    // ここでボタンの色変更
    const updatedData = { ...data };
    updatedData[uuid].start_flg = updatedData[uuid].start_flg ? false : true;
    setData(updatedData);
    // タイマーの起動リセット
    if (updatedData[uuid].start_flg) {
      const id = setInterval(() => {
        // ここは別処理になるので下記で再度宣言しないと、タイマーが更新されない
        const updatedData = { ...data };
        updatedData[uuid].timer = updatedData[uuid].timer + 1;
        setData(updatedData);
      }, 1000);
      updatedData[uuid].timer_id = id;
      setData(updatedData);
    } else {
      clearInterval(updatedData[uuid].timer_id);
      updatedData[uuid].timer_id = 0;
      updatedData[uuid].timer = 0;
      setData(updatedData);
    }

    //blue開始を行う
  }

  // numberを00:00:00がたに変換
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <ScrollView>
      <Alert visible={visible} text="うつ伏せになっています！" />
      <View style={styles.container}>
      <Text style={{color: 'white', backgroundColor: 'blue', width: '100%', padding: 10}}>トークン：{token}</Text>
      {Object.keys(data).map(key => (
        key == 'visible' ? '' : <UserView key={`${key}`} name={data[key].name} allow={data[key].allow} tantou={data[key].tantou} start_flg={data[key].start_flg} onclick={() => onClickStartEnd(key)} timer={formatTime(data[key].timer)} />
      ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    //display: flexの場合に使える。許されたスペースをフルで使うことができ、1,2とかで均等に分けることも可能
    flex: 1,
    backgroundColor: 'lightblue',
    justifyContent: 'flex-start', // 上端揃え
    alignItems: 'center', // 要素
    paddingHorizontal: 20, // 左右の余白
    paddingTop: 50,
    paddingBottom: 50,
    minHeight: screenHeight,
  },
});
