import _ from 'lodash';
import $ from 'jquery';
import * as Conf from './conf.es6';
import * as Nav from './nav.es6';
import * as RSVP from './rsvp.es6';
import {activate, deactivate, isActive, toggle} from "./active.es6";

/*
  Import doesn't do anything -- we just copied Bootstrap's Carousel and
  added some things to make it play nice with ES6
*/
import * as Carousel from "./carousel.js";


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

// Photo carousel
const carousel = "#photo-carousel";
function setCarousel() {
  $(carousel).carousel({
    interval: 5000
  });

  $(carousel).find('img').click(function() {
    let src = $(this).attr('src');
    if (src) {
      window.open(src,'_blank');
    }
  })
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

  // Configure photo carousel
  setCarousel();

  // Hook up RSVP code
  RSVP.init();
}


$(document).ready(function() {
  init();
});



/* For console */
window.$ = window.jquery = $;
window._ = window.lodash = _;
