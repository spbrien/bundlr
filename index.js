#!/usr/bin/env node
const prog = require('caporal');
const exec = require('child_process').exec;

const vue = require('rollup-plugin-vue')
const buble = require('rollup-plugin-buble')
const nodeResolve = require('rollup-plugin-node-resolve')
const gzip = require("rollup-plugin-gzip")
const uglify = require('rollup-plugin-uglify')
const replace = require('rollup-plugin-replace')
const fs = require('fs')
const path = require('path')


prog
  .version('1.0.0')
  .argument('<name>', 'Component name')
  .argument('<path>', 'Path to Vue component')
  .argument('<output>', 'Output Path')
  .action(function(args, options, logger) {
    const rollup = require('rollup');
    const inputOptions = {
      entry: `${__dirname}/src/main.js`,
      plugins: [
          replace({
              'process.env.NODE_ENV': JSON.stringify('production'),
              'process.env.COMPONENT_PATH': JSON.stringify(path.resolve(process.cwd(), args.path)),
              'process.env.COMPONENT_NAME': JSON.stringify(args.name),
          }),
          nodeResolve({
              module: true,
              jsnext: true,
              main: true
          }),
          vue({
              compileTemplate: true,
              css:true
          }),
          buble(),
          uglify(),
          gzip()
      ],
    };
    const outputOptions = {
      dest: args.output,
      format: 'iife',
      name: args.name,
    };
    async function build() {
      // create a bundle
      const bundle = await rollup.rollup(inputOptions);

      // generate code and a sourcemap
      // const { code, map } = await bundle.generate(outputOptions);

      // or write the bundle to disk
      await bundle.write(outputOptions);
    }
    build();
  });

prog.parse(process.argv);
