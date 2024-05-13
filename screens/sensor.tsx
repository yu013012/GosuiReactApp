import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {BlueStart, BlueEnd} from '../helper/blue_connect'

// 縦画面サイズの取得
const screenHeight = Dimensions.get('window').height;

const Sensor = () => {
    const route = useRoute();
    const { mno, token, tno } = route.params as { mno?: string, token?: string, tno?: string };

    useEffect(() => {
        if (mno && token && tno) {
            BlueStart(mno, token, tno);
        }
    
        // アンマウント処理
        return () => {
           BlueEnd()
        }
      }, [mno, token, tno]);

    return (
        <View style={styles.container}>
            <View style={styles.container2}>
                <Text style={{color: 'white', fontSize: 20}}>
                    センサーの接続を行っております。{'\n'}
                    接続するセンサーを充電コードに接続してください。{'\n'}
                    接続が完了したらアプリは再起動されます。
                </Text>
            </View>
            <View>
                <Text style={{color: 'red', fontSize: 20}}>※複数のセンサーを充電コードに接続しないように注意してください。</Text>
            </View>
            <ActivityIndicator style={{paddingTop: 50, paddingBottom: 50}} size="large" color="#0000ff" />
        </View>
    );
};

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
    container2: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1fa19b',
      marginBottom: 30,
      width: '100%',
      padding: 10
    },
    toggleContainer: {
      marginLeft: 10, // 適宜調整してください
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default Sensor;