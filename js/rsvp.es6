/*
  RSVP Section
*/

const _ = require('lodash');
const $ = require('jquery');

/*
  Save info for a guest to Firebase

  data: {
    attending: boolean;
    names: {
      first: string;
      last: string;
    }[];
    email: string;
    address: string;
  }
*/
export function saveGuest(data) {
  console.info(data);
  var updates = {};
  var key = firebase.database().ref().child('guests').push().key;
  updates['/guests/' + key] = data;
  firebase.database().ref().update(updates).then(onSave, onError)
}

// Takes serialized name-value pairs and forms it for saving
function formatData(data) {
  var firstNames = _(data)
    .filter((d) => d.name === "first-name")
    .map((d) => d.value)
    .value();
  var lastNames = _(data)
    .filter((d) => d.name === "last-name")
    .map((d) => d.value)
    .value();
  var names = _.map(
    _.zip(firstNames, lastNames),
    (tuple) => ({
      first: (tuple[0] || "").trim(),
      last: (tuple[1] || "").trim()
    })
  );
  names = _.filter(names, (n) => n.first || n.last);

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
const activeClass = "active";

function activate(elm) {
  $(elm).addClass(activeClass);
}

function deactivate(elm) {
  $(elm).removeClass(activeClass);
}

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

export function cloneTemplate() {
  var newGuest = $(guestTemplate).clone();
  newGuest.removeClass(templateClass);
  $(guestContainer).append(newGuest);
  newGuest.find(rmGuestBtn).click(function() {
    $(this).parents(groupSelector).remove();
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
    cloneTemplate();
  });

  $(submitBtn).click(function(e) {
    e.preventDefault();
    if (validate()) {
      var data = $(rsvpForm).serializeArray();
      saveGuest(formatData(data));
    }
  });

  toggleYesNo();
}
