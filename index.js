#!/usr/bin/env node
const prog = require('caporal');
const exec = require('child_process').exec;

const webpack = require("webpack");
const rimraf = require('rimraf');
const fs = require('fs')
const path = require('path')


prog
  .version('1.0.0')
  .argument('<name>', 'Component name')
  .argument('<path>', 'Path to Vue component')
  .argument('<output>', 'Output Path')
  .option('-s, --single', 'Create a single JS file with all dependencies included', prog.BOOL, false)
  .action(function(args, options, logger) {
    const webpackConfig = {
      entry: options.single ? `${__dirname}/src/single.js` : `${__dirname}/src/main.js`,
      output: {
        path: path.resolve(process.cwd(), args.output),
        filename: `${args.name}.js`,
      },
      resolve: {
        extensions: ['.js', '.vue'],
        alias: {
          'vue$': 'vue/dist/vue.common.js'
        }
      },
      module: {
        rules: [
          {
            test: /\.vue$/,
            use: 'vue-loader'
          },
          {
            test: /\.js$/,
            use: 'babel-loader'
          }
        ]
      },
      devtool: '#source-map',
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"production"',
            COMPONENT_PATH: JSON.stringify(`${path.resolve(process.cwd(), args.path)}`),
            COMPONENT_NAME: JSON.stringify(`${args.name}`),
          }
        }),
        new webpack.optimize.UglifyJsPlugin({
          // uncomment to enable sourcemap
          // sourceMap: true,
          compress: {
            warnings: false
          }
        }),
        new webpack.LoaderOptionsPlugin({
          minimize: true
        })
      ]
    };

    rimraf(path.resolve(process.cwd(), args.output), () => {
      webpack(webpackConfig, (err, stats) => {
        if (err || stats.hasErrors()) {
          process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
            chunks: false,
            chunkModules: false
          }) + '\n\n')
        } else {
          console.log('Done!')
        }
        // Done processing
      });
    });
  });

prog.parse(process.argv);
