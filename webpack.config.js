const path = require('path');

module.exports = {
  entry: {
    server: './server/master.ts'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'main.server': path.join(__dirname, 'dist', 'server', 'main.bundle.js')
    }
  },
  target: 'node',
  externals: [/(node_modules|main\..*\.js)/],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
}
