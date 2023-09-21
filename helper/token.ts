import DeviceInfo from 'react-native-device-info';

export const Token = async () => {
  try {
    DeviceInfo.getUniqueId().then((uniqueId) => {
      console.log(uniqueId)
      //return `${uniqueId}`
    });
    console.log("uniqueId")
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }

  return "token"
}
