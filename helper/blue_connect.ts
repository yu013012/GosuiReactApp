import BleManager from 'react-native-ble-manager';
import React, { Component, useState } from 'react';
import { NativeModules, NativeEventEmitter } from "react-native";
import { useMyContext, MyContextType } from '../contexts/MyContext';
import ApiConnect from '../helper/api_connect'
import RNRestart from 'react-native-restart';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

let scanTimer: any;
let mno: string;
let token: string;
let tno: string;

// apiの引数の型(パラメーター部分)
type Params = {
    [key: string]: string
}

export const BlueStart = (mno_: string, token_: string, tno_: string) => {

    mno = mno_;
    token = token_;
    tno = tno_;

    const handleRestart = () => {
        RNRestart.Restart(); // アプリを再起動するメソッドを呼び出す
    };

  const bluestart = async () => {
    const flg = await BleManager.start({showAlert: false}).then(() => {
      return true;
    }).catch((error) => {
      console.log('初期化失敗')
      return false;
    });

    if (flg) {
      scanTimer = setInterval(bluescan, 6000);
    }
  }

  // TODO 充電切れなどで接続が切れた場合の対応
  // 10秒に一回ほど通知を受け取っているか確認し、受け取っていなければ接続を試みる
  const blueconnect = async (args: any) => {
    BleManager.connect(args.id).then(() => {
      // console.log(`connectしました${args.id}`)
      // 書き込みに必要、iosは通知にも必要？
      BleManager.retrieveServices(`${args.id}`).then(
        (peripheralInfo) => {
          // Success code
          console.log("Peripheral info:", peripheralInfo);
          BleManager.writeWithoutResponse(
            args.id,
            "0000C62E-9910-0BAC-5241-D8BDA6932A2F",
            "00000D2E-1C03-ACA1-AB48-A9B908BAE79E",
            [0x28, 0x43, 0x44, 0x02, 0x03, 0x29]
          )
          .then((data) => {
            BleManager.startNotification(
              args.id,
              "0000C62E-9910-0BAC-5241-D8BDA6932A2F",
              "00005991-B131-3396-014C-664C9867B917"
            )
            .then(() => {
              console.log("通知設定完了")
            }).catch((error) => {
              console.log("通知設定失敗");
              blueconnect(args)
            });
          })
          .catch((error) => {
            console.log(`書き込みに失敗${error}`);
            blueconnect(args)
          });
        }
      );
    })
    .catch((error) => {
      // 接続失敗
      console.log(error);
    });
  }

  // 定期的なスキャンを開始するタイマー
  const bluescan = async () => {
    await BleManager.scan([], 5000, true).then(() => {
      console.log("scan開始");
    })
  }

  bluestart()

  // 下記検索結果
  bleManagerEmitter.addListener(
    'BleManagerDiscoverPeripheral',
    (args) => {
      if (args.name == "AKOI_HEART") {
        console.log(args);
        // 下記接続処理
        blueconnect(args)
      }
    }
  );

  // 定期的に通知を取得
  bleManagerEmitter.addListener(
    "BleManagerDidUpdateValueForCharacteristic",
    ({ value, peripheral, characteristic, service }) => {
      // setStateで値の変更をする場合下記のように別変数に定義しないといけない
      let blueData: string = String(value);
      // console.log(blueData)
      let dataArray: string[] = blueData.split(',');

      // バッテリーMax212、バッテリーMin100
      // 充電中
      if (dataArray[6] == "2") {
        console.log(peripheral+"発見")
        console.log(token+","+mno)
        const params: Params = {
            ACT: 'UPDATE_SENSOR',
            TNO: tno,
            MNO: mno,
            ID: peripheral,
            TOKEN: token,
        }
        ApiConnect({ params_: params })
        // APIで送る、トークン、id、ナンバー
        handleRestart()
      } else {
        console.log("違う、接続キル")
        BleManager.stopNotification(
            peripheral,
            "0000C62E-9910-0BAC-5241-D8BDA6932A2F",
            "00005991-B131-3396-014C-664C9867B917"
        )
        BleManager.disconnect(peripheral)
        .then(() => {
            // Success code
            console.log(`${peripheral}：切断`);
        })
        .catch((error) => {
            // Failure code
            console.log(`${peripheral}：切断失敗`);
        });
      }
    }
  );
}

export const BlueEnd = () => {

  clearInterval(scanTimer);
  BleManager.stopScan().then(() => {
    // Success code
    console.log("スキャン終了");
  });
}
