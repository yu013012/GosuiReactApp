import React, { useState } from 'react';
import { View, Text, Button, Modal } from 'react-native';

type dataProps = {
  visible: boolean,
  text: string
}

export const Alert = (props: dataProps) => {
  const {visible, text} = props

  return (
      <Modal
        animationType="slide" // モーダルの表示アニメーションを設定
        transparent={true} // 背景を透明にする
        visible={visible} // モーダルの表示状態
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'grey', padding: 20, opacity: 1, width: '80%', alignItems: 'center' }}>
            <Text style={{color: 'red', fontSize: 17}}>{text}</Text>
          </View>
        </View>
      </Modal>
  )
}
