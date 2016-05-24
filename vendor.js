/*
  Include third party dependencies for Browserify -- just adding to global
  scope but makes using NPM packages more straight forward
*/

window._ = require("lodash");
window.$ = window.jQuery = require("jquery");
window.moment = require("moment");
window.page = require("page");

// This modifies jQuery
require("bootstrap");
