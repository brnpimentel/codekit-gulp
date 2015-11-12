# codekit-gulp
> Gulp configuration to mimic codekit features

## features
**JAVASCRIPT**
- JsHint
- Uglify
- import js files inside js file (inject/include - inline include):

⋅⋅⋅In JS file use: ``` //include("bar.js"); ```
⋅⋅⋅in this line the content of *bar.js* will be injected
⋅⋅⋅when save, will run joshing

- nested imports
- support for **partials javascript files** (_file.js)
⋅⋅⋅these files will not be piped to *dist* folders. These files are imported by others files.
⋅⋅⋅when save partial:  scripts run jshint on partial, find all the "imported by" files (parents files),  inject and use uglify on these files
- compile the necessary files (changed files). If is a partial, or imported, the parents will be processed.

**SASS/SCSS/CSS**
- Support _partials and only compile the necessary files (parents of the imports);
- Sass/Scss options (compressed, expanded etc..)

**OTHER FEATURES**
- browser-sync (live reload when edit files)
- watch (watch files for modifications and run tasks)
- reload browser on change file (html, php, jpg, gif, png) - Use package.json to configure


## install
```shell
npm install --save-dev
```

## configure
To configure, edit file **package.json**.

**Suggest directory structure:

```
├── app/
│   ├── scss/
│   ├── js/
│   ├── public/
│   │   ├── css/ 
│   │   ├── js/
```

## usage
For initialize, use:
```shell
gulp
```
This command will run **default** task:
- webserver (port default 5858) task
- watch task
