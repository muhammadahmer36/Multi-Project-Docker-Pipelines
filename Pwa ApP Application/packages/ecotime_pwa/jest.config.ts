export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: ['node_modules', 'src'],
  transform: { '^.+\\.tsx?$': ['ts-jest'] },
  automock: false,
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './html-report',
      filename: 'report.html',
      expand: true,
    }],
  ],
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/test/__mocks__/mock.ts',
    '\\.(scss|sass|css)$': 'identity-obj-proxy',
    'virtual:pwa-register/react': '<rootDir>/src/test/__mocks__/virtualpwa-register/index.ts',
  },
};
