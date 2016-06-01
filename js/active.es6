/*
  Activate / de-activate elements to show/hide
*/

import $ from 'jquery';
const activeCls = "active";

export function activate(selector) {
  $(selector).addClass(activeCls);
}

export function deactivate(selector) {
  $(selector).removeClass(activeCls);
}

export function isActive(selector) {
  return $(selector).hasClass(activeCls);
}

export function toggle(selector) {
  if (isActive(selector)) {
    deactivate(selector);
  } else {
    activate(selector);
  }
}
