# Bundlr

A command line utility for packaging Vue components as web components / custom elements.

## Installation

```
npm install -g git+https://git@github.com:spbrien/bundlr.git
```

## Usage

There are two options for building out custom elements from Vue components:

---

You can build as completely stand-alone and self contained scripts. This is useful if you are only including a single custom element in your page. With this option, all necessary dependencies are bundled into your final script. If you include more than one custom element built this way, you will be including the Vue dependency, and potentially others, multiple times.

Build your script:

```bash
# bundlr <component name> <input file path> <output file path>
bundlr custom-component ./path/to/custom-component.vue ./output/path/custom-component.js --single
```

Include the script and element in your html:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="./output/path/custom-component.js"></script>
</head>
<body>
<custom-component></custom-component>
</body>
</html>
```

---

You can also build components that use a global Vue instance instead of including Vue in the bundled script. This is useful if you are including multiple custom elements per page. With this option, each custom element will share the same global Vue instance.

Build your script:

```bash
# bundlr <component name> <input file path> <output file path>
bundlr custom-component ./path/to/custom-component.vue ./output/path/custom-component.js
```

Include the script and element in your html:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/vue@2.5.16/dist/vue.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vue-custom-element@3.0.2/dist/vue-custom-element.min.js"></script>

  <script src="./output/path/custom-component.js"></script>
</head>
<body>
<custom-component></custom-component>
</body>
</html>
```

## More info

This script uses [Vue Custom Element](https://github.com/karol-f/vue-custom-element). Documentation and a full list of features can be found on [that library's website](https://karol-f.github.io/vue-custom-element/#/).
