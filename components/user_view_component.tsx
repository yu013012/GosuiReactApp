import React from 'react'
import {StyleSheet, View, Text, Image, Button, TextInput, TouchableOpacity, ScrollView, ImageBackground, KeyboardAvoidingView} from 'react-native';
import constants from '../helper/constants'

type dataProps = {
  name?: string,
  allow?: string,
  tantou?: string,
  start_flg?: boolean,
  onclick?: () => void,
  timer?: string | undefined,
  no?: string,
  battery?: number
}

// ()はリターンがいらないけど、{}はいる
export const UserView = (props: dataProps) => {
  const { name, allow, tantou, start_flg, onclick, timer, no, battery } = props
  
  var png_link: any = require('../assets/full.png')
  var png_flg: boolean = false
  if (battery == 1) {
    png_link = require('../assets/charge.png')
    png_flg = true
  } else if (battery == 2) {
    png_link = require('../assets/none.png')
    png_flg = true
  } else if (battery == 3) {
    png_flg = true
  }
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={start_flg ? styles.start_end_button_red : styles.start_end_button} onPress={onclick}>
        <Text style={{color: 'white', fontSize: 20}}>{start_flg ? constants.end : constants.start}</Text>
      </TouchableOpacity>
      <Text style={styles.timer}>{timer ? timer : '00:00:00'}</Text>

      <View style={styles.row_view}>
        <View style={styles.number}>
          <Text style={styles.tantou_number}>{no}</Text>
        </View>
      </View>

      <View style={styles.row_view}>
        <View style={styles.tantou_view1}>
          <Text style={styles.tantou_number}>{constants.tantou}</Text>
        </View>
        <View style={styles.tantou_view2}>
          <Text style={styles.tantou_number}>{tantou ? tantou : constants.tantou_none}</Text>
        </View>
        <View style={styles.battery_view}>
        {png_flg ? (
          <Image
            style={styles.image}
            source={png_link}
          />
        ) : null}
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
    backgroundColor: '#1fa19b',
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
  },
  tantou_number: {
    color: 'white',
    fontSize: 20,
    padding: 10
  },
  tantou_view1: {
    marginTop: 5,
    backgroundColor: '#1fa19b',
    width: '20%',
    alignItems: 'center', // 要素
    justifyContent: 'center',
  },
  tantou_view2: {
    marginTop: 5,
    backgroundColor: '#1fa19b',
    width: '68%',
    alignItems: 'center', // 要素
    justifyContent: 'center',
  },
  battery_view: {
    marginTop: 5,
    backgroundColor: '#1fa19b',
    width: '10%',
    alignItems: 'center', // 要素
    justifyContent: 'center',
  },
  allow_view: {
    justifyContent: 'center',
    backgroundColor: '#4a91ff',
    width: '20%',
    height: 100,
    alignItems: 'center', // 要素
    
  },
  allow: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    padding: 10,
  },
  name_view: {
    justifyContent: 'center',
    backgroundColor: '#1fa19b',
    width: '78%',
    alignItems: 'center', // 要素
    height: 100,
  },
  name: {
    fontSize: 20,
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
  number: {
    marginTop: 5,
    backgroundColor: '#1fa19b',
    width: '100%',
    alignItems: 'center', // 要素
    justifyContent: 'center',
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: 'cover', // 画像のリサイズモード
  },
});
