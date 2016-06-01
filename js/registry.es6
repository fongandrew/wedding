import _ from 'lodash';
import $ from 'jquery';
import * as Conf from './conf.es6';
import * as Nav from './nav.es6';
import {activate, deactivate, isActive, toggle} from "./active.es6";


function init() {
  // Navbar settings
  Nav.init();
}

$(document).ready(function() {
  init();
});


/* For console */
window.$ = window.jquery = $;
window._ = window.lodash = _;
