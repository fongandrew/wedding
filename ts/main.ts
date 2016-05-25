/// <reference path="../typings/browser.d.ts" />

namespace AFCC {
  export function activate(selector: string) {
    $(selector).addClass("active");
  }

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

  export function init() {
    // Splash
    setTimeout(splashDanceParty, Conf.DancePartyHeaderStart);
    setTimeout(splashDancePartyBunnies, Conf.DancePartyHeaderBunnies);
    setTimeout(showDateLocationHeader, Conf.ShowDateLocationHeader);

    // Map
    fixMap();
    $(window).scroll(fixMap);
  }
}

$(document).ready(function() {
  AFCC.init();
});
