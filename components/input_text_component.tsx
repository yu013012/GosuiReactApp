import React from 'react'
import {StyleSheet, View, TextInput} from 'react-native';

type dataProps = {
  placeholder_: string,
  handleChange_?: (text: string) => void
  value_: string,
  secureTextEntry_: boolean,
  id_: string
}

const Input = (props: dataProps) => {
  const { placeholder_, handleChange_, value_, secureTextEntry_, id_ } = props

  return (
    <TextInput
      secureTextEntry={secureTextEntry_}
      placeholder={placeholder_}
      placeholderTextColor="gray"
      onChangeText={handleChange_}
      value={value_}
      style={styles.textInput}
      testID={id_}
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
