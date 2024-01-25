import React, { Component } from 'react';
import { View, Button } from 'react-native';
import Sound from 'react-native-sound';

// Soundオブジェクトの初期化
const sound = new Sound('mimawari.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('音声ファイルの読み込みエラー', error);
    return;
  }
});

const AlertSoundM = () => {
  sound.play((success) => {
    if (success) {
      console.log('音声再生が完了しました');
    } else {
      console.log('音声再生中にエラーが発生しました');
    }
  });
}

export default AlertSoundM
