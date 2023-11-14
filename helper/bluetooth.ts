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
      console.log('初期化失敗')
      return false;
    });

    if (flg) {
      bluescan
      scanTimer = setInterval(bluescan, 5000);
    }
  }

  // 定期的なスキャンを開始するタイマー
  const bluescan = async () => {
    await BleManager.scan([], 5000, true).then(() => {
      console.log("scan開始");
    })
  }

  bluestart()
  console.log(data)

  // 下記検索結果
  bleManagerEmitter.addListener(
    'BleManagerDiscoverPeripheral',
    (args) => {
      if (args.name == "AKOI_HEART") {
        console.log(`test${args.id}${data[args.id]}`)
      }
      if (args.name == "AKOI_HEART" && data[args.id] != undefined) {
        // 下記接続処理
        BleManager.connect(args.id).then(() => {
          console.log(`connectしました${args.id}`)
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
                  BleManager.disconnect(args.id)
                  .then(() => {
                    // Success code
                    console.log("Disconnected");
                  })
                  .catch((error) => {
                    // Failure code
                    console.log(error);
                  });
                });
              })
              .catch((error) => {
                console.log(`書き込みに失敗${error}`);
                BleManager.disconnect(args.id)
                .then(() => {
                  // Success code
                  console.log("Disconnected");
                })
                .catch((error) => {
                  // Failure code
                  console.log(error);
                });
              });
            }
          );
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
      // setStateで値の変更をする場合下記のように別変数に定義しないといけない
      const updatedData = { ...data };
      let blueData: string = String(value);
      let dataArray: string[] = blueData.split(',');
      // うつ伏せ
      if (31 <= Number(dataArray[17]) && Number(dataArray[17]) <= 65) {
        updatedData[peripheral].allow = "↓"
      // 仰向け
      } else if (128 <= Number(dataArray[17]) && Number(dataArray[17]) <= 223) {
        updatedData[peripheral].allow = "↑"
      // 横向きの時
      } else if (224 <= Number(dataArray[17]) && Number(dataArray[17]) <= 255 || 0 <= Number(dataArray[17]) && Number(dataArray[17]) <= 30) {
        // 右向き
        if (190 <= Number(dataArray[15]) && Number(dataArray[15]) <= 255) {
          updatedData[peripheral].allow = "→"
        // 左向き
        } else if (0 <= Number(dataArray[15]) && Number(dataArray[15]) <= 65) {
          updatedData[peripheral].allow = "←"
        // 上向き
        } else {
          updatedData[peripheral].allow = "↑"
        }
      // 72 ~ 127 : シェイク判定(上向き)
      } else {
        updatedData[peripheral].allow = "↑"
      }

      setData(updatedData)
    }
  );
}

export const BlueEnd = (data: MyContextType) => {

  clearInterval(scanTimer);

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
