module.exports = {
    preset: "react-native",
    moduleFileExtensions: [
      "ts",
      "tsx",
      "js"
    ],
    transform: {
      "^.+\\.(js)$": "<rootDir>/node_modules/babel-jest",
      "\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
      '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
    },
    testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
    testPathIgnorePatterns: [
      "\\.snap$",
      "<rootDir>/node_modules/",
       '^.+\\.js$'
    ],
    cacheDirectory: ".jest/cache",
    setupFiles: [
      '<rootDir>/setup.js', // React NativeのJestセットアップファイルのパス
    ],
    moduleNameMapper: {
      'react-native-permissions': '<rootDir>/__mocks__/react-native-permissions.js',
      'react-native-sound': '<rootDir>/__mocks__/react-native-sound.js',
      "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/__mocks__/image-mock.js",
      "react-native-gesture-handler": "<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js",
      '^axios$': require.resolve('axios')
    },
    testEnvironment: 'jest-environment-jsdom',
};
