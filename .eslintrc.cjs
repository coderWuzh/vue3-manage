module.exports = {
  extends: [
    '@antfu',
  ],
  rules: {
    'no-tabs': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prefer-promise-reject-errors': 'off',
  },
}
