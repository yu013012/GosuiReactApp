import BleManager from 'react-native-ble-manager';
import React, { Component, useState } from 'react';
import { NativeModules, NativeEventEmitter } from "react-native";
import { useMyContext, MyContextType } from '../contexts/MyContext';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

let scanTimer: any;

export const BlueStart = (data: MyContextType, setData: React.Dispatch<React.SetStateAction<MyContextType>>) => {
  const bluestart = async () => {
    const flg = await BleManager.start({showAlert: false}).then(() => {
      return true;
    }).catch((error) => {
      // console.log('初期化失敗')
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
              // console.log("通知設定完了")
            }).catch((error) => {
              console.log("通知設定失敗");
              blueconnect(args)
            });
          })
          .catch((error) => {
            // console.log(`書き込みに失敗${error}`);
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
      // 大文字小文字変換
      const uppercasedString = args.id.toUpperCase();
      const lowercasedString = args.id.toLowerCase();
      if (args.name == "AKOI_HEART" && (data[uppercasedString] != undefined || data[lowercasedString] != undefined)) {
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
      var changeCount = 0;
      const updatedData = { ...data };
      let blueData: string = String(value);
      // console.log(blueData)
      let dataArray: string[] = blueData.split(',');
      
      const uppercasedString = peripheral.toUpperCase();
      const lowercasedString = peripheral.toLowerCase();
      if (data[uppercasedString] == undefined && data[lowercasedString] == undefined) {
        return
      }

      if (data[uppercasedString] != undefined) {
        peripheral = uppercasedString
      }
      
      if (data[lowercasedString] != undefined) {
        peripheral = lowercasedString
      }

      // バッテリーMax212、バッテリーMin100
      // 充電中
      if (dataArray[6] == "2") {
        if (updatedData[peripheral].battery != 1) {
          changeCount++;
        }
        updatedData[peripheral].battery = 1
        console.log("充電中")        
      // バッテリー半分以下
      } else if (parseInt(dataArray[12], 10) <= 130) {
        if (updatedData[peripheral].battery != 2) {
          changeCount++;
        }
        updatedData[peripheral].battery = 2
        console.log("バッテリーやばい")
      // バッテリー問題なし
      } else {
        if (updatedData[peripheral].battery != 3) {
          changeCount++;
        }
        updatedData[peripheral].battery = 3
        console.log("バッテリーまだ大丈夫")
      }

      // うつ伏せ
      if (31 <= Number(dataArray[17]) && Number(dataArray[17]) <= 65) {
        if (updatedData[peripheral].allow !="↓") {
          changeCount++;
        }
        updatedData[peripheral].allow = "↓"
      // 仰向け
      } else if (128 <= Number(dataArray[17]) && Number(dataArray[17]) <= 223) {
        if (updatedData[peripheral].allow !="↑") {
          changeCount++;
        }
        updatedData[peripheral].allow = "↑"
      // 横向きの時
      } else if (224 <= Number(dataArray[17]) && Number(dataArray[17]) <= 255 || 0 <= Number(dataArray[17]) && Number(dataArray[17]) <= 30) {
        // 右向き
        if (190 <= Number(dataArray[15]) && Number(dataArray[15]) <= 255) {
          if (updatedData[peripheral].allow !="→") {
            changeCount++;
          }
          updatedData[peripheral].allow = "→"
        // 左向き
        } else if (0 <= Number(dataArray[15]) && Number(dataArray[15]) <= 65) {
          if (updatedData[peripheral].allow !="←") {
            changeCount++;
          }
          updatedData[peripheral].allow = "←"
        // 上向き
        } else {
          if (updatedData[peripheral].allow !="↑") {
            changeCount++;
          }
          updatedData[peripheral].allow = "↑"
        }
      // 72 ~ 127 : シェイク判定(上向き)
      } else {
        if (updatedData[peripheral].allow !="↑") {
          changeCount++;
        }
        updatedData[peripheral].allow = "↑"
      }

      if (changeCount > 0) {
        setData(updatedData)
      }
    }
  );
}

export const BlueEnd = (data: MyContextType) => {

  clearInterval(scanTimer);
  const updatedData = { ...data };
  BleManager.stopScan().then(() => {
    // Success code
    console.log("スキャン終了");
  });

  Object.keys(data).map(key => {
    if (key) {
      BleManager.stopNotification(
        key,
        "0000C62E-9910-0BAC-5241-D8BDA6932A2F",
        "00005991-B131-3396-014C-664C9867B917"
      )
      BleManager.disconnect(key)
      .then(() => {
        // Success code
        console.log(`${key}：切断`);
      })
      .catch((error) => {
        // Failure code
        console.log(`${key}：切断失敗`);
      });
    }
  })
}
