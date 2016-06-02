import _ from 'lodash';
import $ from 'jquery';
import {activate, deactivate, isActive, toggle} from "./active.es6";

// Splits href into base + hash
function getPath(href) {
  var parts = href.split("#");
  return {
    base: parts[0] || location.pathname,
    hash: "#" + (parts[1] || "")
  }
}


/* Navbar toggle */

const navMenu = '.nav-menu';
const navToggle = '.nav-toggle';
const navOnIcon = 'fa-bars';
const navOffIcon = 'fa-close';
const navMenuLinks = navMenu + ' li';

function navToggles() {
  $(navToggle).click(function(e) {
    isActive(navMenu) ? navOff() : navOn();
    e.stopPropagation();
  });

  $("body").click(function() {
    if (isActive(navMenu)) {
      navOff();
    }
  });
}

function navOn() {
  $(navToggle).find(".fa").removeClass(navOnIcon).addClass(navOffIcon);
  activate(navMenu);
}

function navOff() {
  $(navToggle).find(".fa").removeClass(navOffIcon).addClass(navOnIcon);
  deactivate(navMenu);
}


/* Scrolling for navbar */

function navbarScrollLinks() {
  $(".navbar-nav li a, .scroll-link").click(function() {
    var pathObj = getPath($(this).attr('href'));

    // Base is equal to path, try to scroll
    if (location.pathname === pathObj.base) {
      var target = pathObj.hash;
      if (target === "#") { target = "#splash"; }

      var targetElm = $(target);
      if (targetElm.length) {

        // Customize duration based on expected travel time
        var current = $('body').scrollTop();
        var dest = targetElm.offset().top;
        var duration = Math.abs(current - dest) / 1; // 1px per ms

        // Default to 800 if bad math for whatever reason
        if (isNaN(duration)) { duration = 800; }

        // Cap longer scrolls
        duration = Math.min(duration, 1000);

        // Animate scroll
        $('html, body').animate({
          scrollTop: targetElm.offset().top
        }, duration);

        // Nav-off
        navOff();

        // Scrolling, ignore default link behavior
        return false;
      }
    }

    // Not scrolling or base doesn't match -- so just try to go to
    // to link
    return true;
  });
}


// Fire events when scrolling past navlinks
function scrollNavLink() {
  var tops = [];
  var elms = [];
  $(navMenuLinks).each(function(index, elm) {
    var pathObj = getPath($(elm).find('a').attr('href'));

    // Base is equal to path, set up
    if (location.pathname === pathObj.base) {
      var targetElm = $(pathObj.hash);
      if (targetElm.length) {
        tops.push(targetElm.offset().top);
        elms.push($(elm));
      }
    }
  });

  $(window).scroll(function() {
    var offset = window.pageYOffset + 100; // +100 for navbar and padding
    var index = _.findLastIndex(tops, (t) => offset > t);
    if (index >= 0) {
      if (! isActive(elms[index])) {
        deactivate(navMenuLinks);
        activate(elms[index]);
      }
    } else {
      deactivate(navMenuLinks);
    }
  });

  // Trigger initial callback
  $(window).scroll();
}

export function init() {
  navToggles();
  scrollNavLink();
  navbarScrollLinks();
}
