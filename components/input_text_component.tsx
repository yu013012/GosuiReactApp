import React from 'react'
import {StyleSheet, View, TextInput} from 'react-native';

type dataProps = {
  placeholder_: string,
  handleChange_: void,
  value_: string,
  secureTextEntry_: boolean
}

const Input = (props: dataProps) => {
  const { placeholder_, handleChange_, value_, secureTextEntry_ } = props

  return (
    <TextInput
      secureTextEntry={secureTextEntry_}
      placeholder={placeholder_}
      placeholderTextColor="gray"
      onChangeText={handleChange_}
      value={value_}
      style={styles.textInput}
    />
  )
}

const styles = StyleSheet.create({
  textInput: {
    color: 'black', // 文字色を黒に設定
    borderWidth: 1, // ボーダーを追加
    borderColor: 'white', // ボーダーの色を設定
    padding: 10, // 内部の余白を設定
    width: '100%', // 横幅
    margin: 20, // 要素外の余白
    backgroundColor: 'white',
  },
});

export default Input
