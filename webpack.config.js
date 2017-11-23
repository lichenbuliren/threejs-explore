var path = require('path');
var glob = require('glob');
var webpack = require('webpack');

// HTML 文件资源自动引入插件
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
// 使用 md5 算法计算 chunkhash 值
var WebpackMd5Hash = require('webpack-md5-hash');
// 抽取样式文件到独立文件中
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var entries = getEntry('./src/view/**/*.js', './src/');
entries.vendors = ['three', './src/util/index.js', './src/lib/dat.gui.min.js','./src/lib/stats.min.js'];

var webpackConfig = {
  entry: entries,
  output: {
    filename: '[name]/index.[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    }, {
      test: /\.scss/,
      include: [path.resolve(__dirname, 'src')],
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      })
    }, {
      test: /\.js$/,
      include: [path.resolve(__dirname, 'src')],
      loader: 'babel-loader',
      options: {
        presets: [
          ['es2015', {
            modules: false
          }]
        ]
      }
    }]
  },
  plugins: [
    new UglifyJSPlugin({
      beautify: true,
      sourceMap: true,
      include: path.resolve(__dirname, 'src')
    }),
    new ExtractTextPlugin('styles.[chunkhash].css'),
    // 抽取公共文件
    new webpack.optimize.CommonsChunkPlugin({
      // 该插件可以将 webpack 运行产生的编译代码抽取到单独文件 manifest 中，这样子就不会影响最后编译出来的库文件内容的改变
      names: ['vendors', 'manifest'] //vendor libs + extracted manifest
    }),
    new WebpackMd5Hash(),
    new ChunkManifestPlugin({
      filename: 'chunk-manifest.json',
      manifestVariable: 'webpackManifest'
    })
  ],
  devtool: "source-map",
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    // match the output path
    publicPath: '/'
    // match the output `publicPath`
  },
}

var pages = Object.keys(getEntry('./src/view/**/*.html', './src/'));

pages.forEach(function(pathname) {
  var pageConfig = {
    filename: './' + pathname + '/index.html',
    template: './src/' + pathname + '/index.html'
  }

  if (pathname in webpackConfig.entry) {
    pageConfig.chunks = ['vendors', 'manifest', pathname];
  }
  webpackConfig.plugins.push(new HtmlWebpackPlugin(pageConfig));
});

module.exports = webpackConfig;

function getEntry(globPath, pathDir) {
  // 获得所有 JS 文件路径名称
  var files = glob.sync(globPath);
  var entries = {};
  var entry, dirname;
  for (var i = 0; i < files.length; i++) {
    entry = files[i];
    dirname = path.dirname(entry);
    // 作为 entry 的 key 值，需要去掉路径前面的 './dirname' 也就是 './src' ;
    dirname = pathDir ? dirname.replace(new RegExp('^' + pathDir), '') : dirname;
    entries[dirname] = entry;
  }
  return entries;
}