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

  export function init() {
    setTimeout(splashDanceParty, Conf.DancePartyHeaderStart);
    setTimeout(splashDancePartyBunnies, Conf.DancePartyHeaderBunnies);
    setTimeout(showDateLocationHeader, Conf.ShowDateLocationHeader)
  }
}

$(document).ready(function() {
  AFCC.init();
});
