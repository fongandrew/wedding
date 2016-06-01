/*
  RSVP Section
*/

import _ from 'lodash';
import $ from 'jquery';
import {activate, deactivate, isActive, toggle} from "./active.es6";

const MAX_PLUS_NAMES = 4;

/*
  Save info for a guest to Firebase

  data: {
    attending: boolean;
    names: string[];
    email: string;
    address: string;
  }
*/
export function saveGuest(data) {
  var updates = {};
  var key = firebase.database().ref().child('guests').push().key;
  updates['/guests/' + key] = data;
  return firebase.database().ref().update(updates);
}

// Takes serialized name-value pairs and forms it for saving
function formatData(data) {
  var names = _(data)
    .filter((d) => d.name === "guest-name")
    .map((d) => (d.value || "").trim())
    .filter()
    .value();

  return {
    attending: getValue(data, 'attending'),
    names: names,
    email: getValue(data, 'email'),
    address: getValue(data, 'address')
  };
}

function getValue(data, key) {
  var obj = _.find(data, (d) => d.name === key);
  return obj && obj.value;
}


/* Handle error response */

const saveMsg = "#save-msg";
const errorMsg = "#error-msg";

function onSave() {
  activate(saveMsg);
  deactivate(errorMsg);
  $(rsvpForm).hide();
}

function onError(err) {
  activate(errorMsg);
  deactivate(saveMsg);
}


/* Form elements */

const rsvpForm = "#rsvp-form";
const groupSelector = ".name-group";
const templateClass = "template";
const addGuestBtn = "#add-guest-btn";
const rmGuestBtn = ".rm-action";
const guestTemplate = groupSelector + "." + templateClass;
const guestContainer = "#plus-ones";
const submitBtn = "#rsvp-submit-btn";
const requiredSelector = "*[required]:visible";
const emailSelector = "input[type=email]"
const errorClass = "has-error";
const attendingYes = '#attending-yes';
const attendingNo = '#attending-no';
const attendingShow = ".attending-show";
const spinner = ".spinner";

export function cloneTemplate() {
  var newGuest = $(guestTemplate).clone();
  newGuest.removeClass(templateClass);
  $(guestContainer).append(newGuest);
  newGuest.find(rmGuestBtn).click(function() {
    $(this).parents(groupSelector).remove();
    $(addGuestBtn).prop("disabled", false);
  });
}

export function toggleYesNo() {
  $(attendingYes).click(function() {
    $(attendingShow).show();
  });

  $(attendingNo).click(function() {
    $(attendingShow).hide();
  });
}

export function validate() {
  var hasError = false;
  $("." + errorClass).removeClass(errorClass);

  $(rsvpForm).find(requiredSelector).each(function(index, elm) {
    if (! $(elm).val().trim()) {
      $(elm).parents('.form-group').first().addClass(errorClass);
      hasError = true;
    }
  });

  return !hasError;
}

export function init() {
  $(addGuestBtn).click(function(e) {
    e.preventDefault();

    var numChildren = $(guestContainer).children().length;
    if (numChildren < MAX_PLUS_NAMES) {
      cloneTemplate();
      if (numChildren + 1 >= MAX_PLUS_NAMES) {
        $(addGuestBtn).prop("disabled", true);
      }
    }
  });

  $(submitBtn).click(function(e) {
    e.preventDefault();

    if (validate()) {
      activate($(submitBtn).find(spinner));
      $(submitBtn).prop("disabled", true);

      var data = $(rsvpForm).serializeArray();
      var post = function() {
        deactivate($(submitBtn).find(spinner));
        $(e).prop("disabled", false);
      };

      saveGuest(formatData(data))
        .then(onSave, onError)
        .then(post, post);
    }
  });

  toggleYesNo();
}
