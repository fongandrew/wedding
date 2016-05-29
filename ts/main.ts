/// <reference path="../typings/browser.d.ts" />

namespace AFCC {
  const activeCls = "active";

  export function activate(selector: string|JQuery) {
    $(selector).addClass(activeCls);
  }

  export function deactivate(selector: string|JQuery) {
    $(selector).removeClass(activeCls);
  }

  export function isActive(selector: string|JQuery) {
    return $(selector).hasClass(activeCls);
  }

  export function toggle(selector: string|JQuery) {
    if (isActive(selector)) {
      deactivate(selector);
    } else {
      activate(selector);
    }
  }


  ////////

  export function splashDanceParty() {
    activate(".dance-party-header");
  }

  export function splashDancePartyBunnies() {
    activate("#splash .page-background");
  }

  export function showDateLocationHeader() {
    activate(".date-location-header");
  }

  // Fix Google Map scroll issue
  var mapFixed = false;
  export function fixMap() {
    if (mapFixed) return;
    $('.map-container iframe').css("pointer-events", "none");
    $('.map-container').unbind().click(function() {
      $(this).find('iframe').css("pointer-events", "auto");
      mapFixed = false;
    });
  }


  /* Navbar toggle */

  const navMenu = '.nav-menu';
  const navToggle = '.nav-toggle';
  const navOnIcon = 'fa-bars';
  const navOffIcon = 'fa-close';
  const navMenuLinks = navMenu + ' li';

  export function navToggles() {
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

  export function navbarScrollLinks() {
    $(".navbar-nav li a, .scroll-link").click(function() {
      var target = $(this).attr('href');
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

      // Not scrolling -- failed for whatever reason so just try to jump
      // to link
      return true;
    });
  }

  // Fire events when scrolling past navlinks
  export function scrollNavLink() {
    var tops: number[] = [];
    var elms: JQuery[] = [];
    $(navMenuLinks).each(function(index, elm) {
      var target = $(elm).find('a').attr('href');
      var targetElm = $(target);
      if (targetElm.length) {
        tops.push(targetElm.offset().top);
      }
      elms.push($(elm));
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
  }

  // Fire event when scrolling past photo
  export function scrollFirePhoto() {
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

  export function init() {
    // Splash
    setTimeout(splashDanceParty, Conf.DancePartyHeaderStart);
    setTimeout(splashDancePartyBunnies, Conf.DancePartyHeaderBunnies);
    setTimeout(showDateLocationHeader, Conf.ShowDateLocationHeader);

    // Map
    fixMap();
    $(window).scroll(fixMap);

    // Navbar settings
    navToggles();
    scrollNavLink();
    navbarScrollLinks();

    // Misc event handlers
    scrollFirePhoto();
  }
}

$(document).ready(function() {
  AFCC.init();
});
