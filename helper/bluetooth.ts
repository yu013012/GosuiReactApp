import BleManager from 'react-native-ble-manager';
import React, { Component, useState } from 'react';
import { NativeModules, NativeEventEmitter } from "react-native";
import { useMyContext, MyContextType } from '../contexts/MyContext';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const BlueStart = (data: MyContextType, setData: React.Dispatch<React.SetStateAction<MyContextType>>) => {
  console.log(data)
  BleManager.enableBluetooth().then(() => {
    BleManager.start({showAlert: false}).then(() => {
      // 1時間スキャンする
      BleManager.scan([], 18000, true).then(() => {
        console.log("scan開始");
      })
    }).catch(error =>
      console.error('BeManager could not be started.', error),
    );
  }).catch((error) => {
    console.error("The user refuse to enable bluetooth.", error);
  });

  // 下記検索結果
  bleManagerEmitter.addListener(
    'BleManagerDiscoverPeripheral',
    (args) => {
      if (args.name == "AKOI_HEART" && data[args.id]) {
        // 下記接続処理
        BleManager.connect(args.id).then(() => {
          console.log(`connectしました${args.id}`)
          // 書き込みに必要、iosは通知にも必要？
          BleManager.retrieveServices(args.id);
          // 正式な情報を取るには下記書き込みが必要
          BleManager.writeWithoutResponse(
            args.id,
            "0000c62e-9910-0bac-5241-d8bda6932a2f",
            "00000d2e-1c03-aca1-ab48-a9b908bae79e",
            [0x28, 0x43, 0x44, 0x02, 0x03, 0x29]
          )
          .then((data) => {
            console.log(data)
            // 書き込みが完了したら傾きの通知を受け取るように設定
            BleManager.startNotification(
              args.id,
              "0000C62E-9910-0BAC-5241-D8BDA6932A2F",
              "00005991-B131-3396-014C-664C9867B917"
            )
            .then(() => {
              console.log("通知設定完了")
            }).catch((error) => {
              console.log("通知設定失敗");
            });
          })
          .catch((error) => {
            console.log("書き込み失敗");
          });
        })
        .catch((error) => {
          console.log("接続失敗");
        });
      }
    }
  );

  // 定期的に通知を取得
  bleManagerEmitter.addListener(
    "BleManagerDidUpdateValueForCharacteristic",
    ({ value, peripheral, characteristic, service }) => {
      let blueData: string = String(value);
      console.log(data[peripheral].allow)
      let dataArray: string[] = blueData.split(',');
      // うつ伏せ
      if (31 <= Number(dataArray[17]) && Number(dataArray[17]) <= 65) {
        data[peripheral].allow = "↓"
      // 仰向け
      } else if (128 <= Number(dataArray[17]) && Number(dataArray[17]) <= 223) {
        data[peripheral].allow = "↑"
      // 横向きの時
      } else if (224 <= Number(dataArray[17]) && Number(dataArray[17]) <= 255 || 0 <= Number(dataArray[17]) && Number(dataArray[17]) <= 30) {
        // 右向き
        if (190 <= Number(dataArray[15]) && Number(dataArray[15]) <= 255) {
          data[peripheral].allow = "→"
        // 左向き
        } else if (0 <= Number(dataArray[15]) && Number(dataArray[15]) <= 65) {
          data[peripheral].allow = "←"
        // 上向き
        } else {
          data[peripheral].allow = "↑"
        }
      // 72 ~ 127 : シェイク判定(上向き)
      } else {
        data[peripheral].allow = "↑"
      }

      setData(data)
    }
  );
}

export const BlueEnd = (data: MyContextType) => {

  BleManager.stopScan().then(() => {
    // Success code
    console.log("Scan stopped");
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
        console.log("Disconnected");
      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });
    }
  })
}
