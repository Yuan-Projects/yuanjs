yuanjs
======

Features:
 * Deferred Object
 * HTTP (Ajax) request
 * Custom Events
 * DOM Events
 * Selectors

Supported browsers:
 * Internet Explorer
 * Firefox
 * Chrome
 * Safari
 * Opera

## How to build your own YuanJS

Clone a copy of the main YuanJS git repo by running:

    git clone https://github.com/rainyjune/yuanjs.git

Enter the YuanJS directory and install required grunt plugins:

    cd yuanjs && npm install && grunt

The bundled files will be replaced in the `build` directory. `yuan.js` is the development version, `yuan.min.js` is the production version.

If you are interested in this project and want tweak it, running the following in your command line:

    grunt watch
    
Grunt will watch the resource files and generate the bundled files automatically for you after you made any changes in any file of the watch list.
