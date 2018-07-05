#!/usr/bin/env node
const prog = require('caporal');
const exec = require('child_process').exec;

const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const rimraf = require('rimraf');
const fs = require('fs')
const path = require('path')

prog
  .version('1.0.0')
  .argument('<name>', 'Component name')
  .argument('<path>', 'Path to Vue component')
  .argument('<output>', 'Output Path')
  .action(function(args, options, logger) {
    const webpackConfig = {
      entry: `${__dirname}/src/main.js`,
      output: {
        path: path.resolve(process.cwd(), args.output),
        publicPath: "/dist/",
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
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['es2015'],
                plugins: [
                  'syntax-dynamic-import',
                  "transform-custom-element-classes",
                  "transform-es2015-classes"
                ]
              }
            }
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
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false
            }
          },
          parallel: true
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
