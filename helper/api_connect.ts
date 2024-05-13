import axios from 'axios';

type params = {
    [key: string]: string
}

const ApiConnect = async (props: { params_: params }) => { // propsの型を修正
    const { params_ } = props; // propsからparams_を取り出す
    await axios({
        method: 'GET',
        url: "https://www.it-service.co.jp/cgi-local/gosui/gosui_app.pl",
        //url: "https://www.cloudtest2.pw/cgi-local/gosui/gosui_app.pl",
        params: params_,
    })
    .then(response => {
        // 特に何もしない
    })
    .catch(error => {
        // リクエスト失敗時の処理
        console.log('Error:', error);
    });
}

export default ApiConnect
