import _ from 'lodash';
import $ from 'jquery';
import * as Conf from './conf.es6';
import * as Nav from './nav.es6';
import * as RSVP from './rsvp.es6';
import {activate, deactivate, isActive, toggle} from "./active.es6";


/* Dance party */

function splashDanceParty() {
  activate(".dance-party-header");
}

function splashDancePartyBunnies() {
  activate("#splash .page-background");
}

function showDateLocationHeader() {
  activate(".date-location-header");
}

// Fix Google Map scroll issue
var mapFixed = false;
function fixMap() {
  if (mapFixed) return;
  $('.map-container iframe').css("pointer-events", "none");
  $('.map-container').unbind().click(function() {
    $(this).find('iframe').css("pointer-events", "auto");
    mapFixed = false;
  });
}

// Fire event when scrolling past photo
function scrollFirePhoto() {
  $('.page').each(function(index, elm) {
    var top = $(elm).offset().top;
    $(window).scroll(function() {
      // 100px buffer for stuff like navbar
      if (window.pageYOffset + 100 > top) {
        setTimeout(function() {
          $(elm).find('.photo').addClass('active')
        }, Conf.PhotoActiveDelay);
      };
    });
  });
}

function init() {
  // Splash
  setTimeout(splashDanceParty, Conf.DancePartyHeaderStart);
  setTimeout(splashDancePartyBunnies, Conf.DancePartyHeaderBunnies);
  setTimeout(showDateLocationHeader, Conf.ShowDateLocationHeader);

  // Map
  fixMap();
  $(window).scroll(fixMap);

  // Navbar settings
  Nav.init();

  // Misc event handlers
  scrollFirePhoto();

  // Hook up RSVP code
  RSVP.init();
}


$(document).ready(function() {
  init();
});



/* For console */
window.$ = window.jquery = $;
window._ = window.lodash = _;
