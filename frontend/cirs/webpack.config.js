const path = require('path');

module.exports = {
  mode: 'production',  // Ensure mode is set for production build
  entry: './src/index.js',  // Adjust to your project's entry point
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
      // Other loaders can be added here
    ],
  },
};
