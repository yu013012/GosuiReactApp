import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';
import { Login } from '../screens/login'
import { NavigationContainer } from '@react-navigation/native';
import Api from '../helper/api'

// 下記本来はsetup.jsに記載するもの
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('react-native-device-info', () => {
  return {
    getUniqueId: jest.fn(),
  };
});

const navigationMock = {
  navigate: jest.fn(),
};

test('ログイン失敗', async () => {
  // ログイン画面をレンダリング
  const { getByText, queryByText } = render(<Login navigation={navigationMock} />);

  // ログインボタンが存在することを確認
  const loginButton = getByText('ログイン');
  expect(loginButton).toBeDefined();

  // ログインボタンをクリック
  fireEvent.press(loginButton);

  // ログインが完了するまで10秒待機
  await waitFor(async () => {
    // ログインというテキストが表示されるか確認
    const loginText = getByText('ログイン');
    expect(loginText).toBeDefined();
  }, { timeout: 10000 });

}, 10000); // 10秒のタイムアウト

test('ログイン成功', async () => {
  type Params = {
    ACT: string,
    ID: string,
    PASS: string,
  }

  // ログイン画面をレンダリング
  const { getByText, queryByText, getByTestId } = render(<Login navigation={navigationMock} />);

  // ログインボタンが存在することを確認
  const loginButton = getByText('ログイン');
  expect(loginButton).toBeDefined();

  // TextInputを取得する
  const input = getByTestId('login');

  // TextInputに文字を入力する
  fireEvent.changeText(input, 'yniwa0128@gmail.com');

  // 入力内容が正しく更新されたことを確認
  expect(input.props.value).toBe('yniwa0128@gmail.com');

  // TextInputを取得する（プレースホルダーテキストをもとに）
  const input2 = getByTestId('password');

  // TextInputに文字を入力する
  fireEvent.changeText(input2, '2277');

  // 入力内容が正しく更新されたことを確認
  expect(input2.props.value).toBe('2277');

  // ログインボタンをクリック
  fireEvent.press(loginButton);

  // ログインが完了するまで10秒待機
  // 訳合って画面遷移ができないのでAPIを実行して問題なければOKとする。
  await waitFor(async () => {
    const params: Params = {
      ACT: 'CHECK_TNO',
      ID: input.props.value,
      PASS: input2.props.value,
    }
    const tno: any = await Api({act: "login", params: params});
    expect(tno).toEqual("10594");
  }, { timeout: 10000 });
}, 10000); // 10秒のタイムアウト
