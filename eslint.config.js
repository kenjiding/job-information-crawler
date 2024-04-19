module.exports = {
  root: true,  // 确保 ESLint 在你的项目根目录寻找此配置文件
  env: {
    node: true,  // 指定 Node.js 的环境变量
    es2021: true  // 指定 ES2021 全局变量
  },
  extends: [
    'eslint:recommended',  // 启用推荐的规则
    'plugin:@typescript-eslint/recommended',  // 启用 TypeScript 推荐的规则
  ],
  parser: '@typescript-eslint/parser',  // 指定 ESLint 解析器为 TypeScript 解析器
  parserOptions: {
    ecmaVersion: 'latest',  // 使用最新的 ECMAScript 标准
    sourceType: 'module',  // 使用 ES 模块
    project: './tsconfig.json'  // 指向 TypeScript 配置文件
  },
  plugins: [
    '@typescript-eslint'  // 使用 @typescript-eslint/eslint-plugin
  ],
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],  // 指定要检查的文件
      rules: {
        // 在这里自定义或覆盖规则
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',  // 任何使用 'any' 类型的地方发出警告
        'no-unused-vars': 'off',  // 禁用此规则，因为 TypeScript 已有检查
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],  // 允许参数名以 _ 开头的未使用参数
        'quotes': ['error', 'single', { 'avoidEscape': true }],  // 强制使用单引号，允许避免转义
        'semi': ['error', 'always']  // 要求语句结束后有分号
      }
    }
  ]
};
