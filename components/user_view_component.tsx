import React from 'react'
import {StyleSheet, View, Text, Button, TextInput, TouchableOpacity, ScrollView, ImageBackground, KeyboardAvoidingView} from 'react-native';
import constants from '../helper/constants'

type dataProps = {
  key?: string,
  name?: string,
  allow?: string,
  tantou?: string,
  start_flg?: boolean,
  onclick?: void,
  timer?: string,
}

// ()はリターンがいらないけど、{}はいる
export const UserView = (props: dataProps) => {
  const { key, name, allow, tantou, start_flg, onclick, timer } = props

  return (
    <View key={key} style={styles.container}>
      <TouchableOpacity style={start_flg ? styles.start_end_button_red : styles.start_end_button} onPress={onclick}>
        <Text style={{color: 'white'}}>{start_flg ? constants.end : constants.start}</Text>
      </TouchableOpacity>
      <Text style={styles.timer}>{timer ? timer : '00:00:00'}</Text>

      <View style={styles.row_view}>
        <View style={styles.tantou_view1}>
          <Text style={styles.tantou}>{constants.tantou}</Text>
        </View>
        <View style={styles.tantou_view2}>
          <Text style={styles.tantou}>{tantou ? tantou : constants.tantou_none}</Text>
        </View>
      </View>

      <View style={styles.row_view}>
        <View style={styles.allow_view}>
          <Text style={styles.allow}>{allow}</Text>
        </View>
        <View style={styles.name_view}>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
      <View style={styles.dottedLine}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  start_end_button: {
    color: 'white', // 文字色を黒に設定
    padding: 20, // 内部の余白を設定（任意）
    width: '100%', // 横幅
    marginTop: 30,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  start_end_button_red: {
    color: 'white', // 文字色を黒に設定
    padding: 20, // 内部の余白を設定（任意）
    width: '100%', // 横幅
    marginTop: 30,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: 'red',
  },
  timer: {
    color: 'black',
    fontSize: 35
  },
  row_view: {
    marginTop: 5,
    flexDirection: 'row', // 子Viewを横に並べる
    justifyContent: 'space-between', // 子View間にスペースを均等に配置
    width: '100%',
    alignItems: 'left', // 要素
  },
  tantou: {
    color: 'white',
    fontSize: 15,
    alignItems: 'left',
    padding: 10
  },
  tantou_view1: {
    marginTop: 5,
    backgroundColor: 'blue',
    width: '20%',
    alignItems: 'center', // 要素
    justifyContent: 'center',
  },
  tantou_view2: {
    marginTop: 5,
    backgroundColor: 'blue',
    width: '78%',
    alignItems: 'center', // 要素
    justifyContent: 'center',
  },
  allow_view: {
    justifyContent: 'center',
    backgroundColor: 'blue',
    width: '20%',
    alignItems: 'center', // 要素
  },
  allow: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    padding: 10,
  },
  name_view: {
    //marginTop: 5,
    justifyContent: 'center',
    backgroundColor: 'blue',
    width: '78%',
    alignItems: 'center', // 要素
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    padding: 10,
  },
  dottedLine: {
    marginTop: 30,
    borderBottomWidth: 2, // 下線の幅
    borderBottomColor: 'black', // 下線の色
    borderStyle: 'dotted', // 下線のスタイルを点線に設定
    width: '100%', // Viewを横いっぱいに広げる
  },
});
