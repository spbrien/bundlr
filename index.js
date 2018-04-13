#!/usr/bin/env node
const prog = require('caporal');
const exec = require('child_process').exec;

const vue = require('rollup-plugin-vue')
const buble = require('rollup-plugin-buble')
const nodeResolve = require('rollup-plugin-node-resolve')
const uglify = require('rollup-plugin-uglify')
const replace = require('rollup-plugin-replace')
const commonjs = require('rollup-plugin-commonjs')
const rollupjson = require('rollup-plugin-json')
const fs = require('fs')
const path = require('path')


prog
  .version('1.0.0')
  .argument('<name>', 'Component name')
  .argument('<path>', 'Path to Vue component')
  .argument('<output>', 'Output Path')
  .option('-s, --single', 'Create a single JS file with all dependencies included', prog.BOOL, false)
  .action(function(args, options, logger) {
    const rollup = require('rollup');
    const inputOptions = {
      input: options.single ? `${__dirname}/src/single.js` : `${__dirname}/src/main.js`,
      plugins: [
          replace({
              'process.env.NODE_ENV': JSON.stringify('production'),
              'process.env.COMPONENT_PATH': JSON.stringify(path.resolve(process.cwd(), args.path)),
              'process.env.COMPONENT_NAME': JSON.stringify(args.name),
          }),
          nodeResolve({
              module: true,
              main: true,
              jsnext: true,
              preferBuiltins: true,
              browser: true,
          }),
          commonjs({
            include: 'node_modules/**'  // Default: undefined
          }),
          rollupjson(),
          vue({
              compileTemplate: true,
              css:true
          }),
          buble(),
          uglify()
      ],
    };
    const outputOptions = {
      file: args.output,
      format: 'iife',
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
