import React, { useState } from 'react';
import { View, Text, Button, Modal } from 'react-native';
import { MyContextType } from '../contexts/MyContext';

type dataProps = {
  visible: boolean,
  text: string,
  data?: MyContextType|undefined
}

export const Alert_ = (props: dataProps) => {
  const {visible, text, data} = props
  var alert_text: string = ''
  if (data && data !== undefined) {
    Object.keys(data).map(key => {
      if (data[key].start_flg && data[key].allow === '↓') {
        if (alert_text !== "") {
          alert_text = alert_text + "、"
        }
        alert_text = alert_text + data[key].name + 'さん'
      }
    })
    alert_text = alert_text + text
  } else {
    alert_text = text
  }

  return (
      <Modal
        animationType="fade" // モーダルの表示アニメーションを設定
        transparent={true} // 背景を透明にする
        visible={visible} // モーダルの表示状態
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'red', padding: 20, opacity: 1, width: '80%', alignItems: 'center' }}>
            <Text style={{color: 'white', fontSize: 23}}>{alert_text}</Text>
          </View>
        </View>
      </Modal>
  )
}
