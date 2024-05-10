import axios from 'axios';
import { MyContextType } from '../contexts/MyContext';
import { Platform } from 'react-native'
type dataProps = {
  act: string,
  params: {
    [key: string]: string
  },
  setData?: React.Dispatch<React.SetStateAction<MyContextType>>
}

const Api = async (props: dataProps): Promise<string | MyContextType> => {
  const {act, params, setData} = props
  const result: string | {} = await axios({
    method: 'GET',
    //url: "https://www.it-service.co.jp/cgi-local/gosui/gosui_app.pl",
    url: "https://www.cloudtest2.pw/cgi-local/gosui/gosui_app.pl",
    params: params,
  })
  .then(response => {
    // リクエスト成功時の処理
    if (act == "login") {
      return String(response.data['tno'])
    } else if (act == "get_data") {
      const data: MyContextType = {}
      // ループを使って連想配列を構築
      for (let i = 1; i <= 10; i++) {
        let key = response.data[`uuid${i}`];
        if (Platform.OS === 'android') {
          key = response.data[`mac${i}`];
        }
        if ( !key ) {
          continue;
        }
        data[key] = {
          name: response.data[`name${i}`],
          allow: "",
          tantou: response.data[`tantou${i}`],
          start_flg: false,
          timer: 0,
          timer_id: 0,
          mno: response.data[`mno${i}`],
          category: response.data[`katego${i}`],
          no: response.data[`no${i}`],
          battery: 0,
        };
      }

      if (setData !== undefined && setData !== null) {
        setData(data);
      }

      return data
    } else if (act == 'update_data') {
      if (response.data) {
        console.log(`担当: ${response.config.params.tantou_react}失敗`)
        return "ng"
      }
    }
    return ""
  })
  .catch(error => {
    // リクエスト失敗時の処理
    console.log('Error:', error);
    return ""
  });

  return result;
}

export default Api
