import _ from 'lodash';
import $ from 'jquery';

var postLoginDfd = $.Deferred();
var postLogin = postLoginDfd.promise();

/* Firebase Authentication */
function signIn() {
  firebase.auth().getRedirectResult().then(function(result) {
    if (result && result.user) {
      postLoginDfd.resolve(result.user);
    } else {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    }
  }, function(err) {
    postLoginDfd.reject(err);
  });
}

function signOut() {
  firebase.auth().signOut().then(function() {
    location.reload();
  }, function(err) {
    console.error(err);
  });
}

function onLogin() {
  getResponses();
}

function onAuthCheck(user) {
  if (user) {
    postLoginDfd.resolve(user);
  } else {
    signIn();
  }
}


/* Display responses */
const responseTable = "#responses";

function getResponses() {
  console.info("Getting responses");
  firebase.database().ref('/guests').once('value')
    .then(function(snapshot) {
      console.info("Responses received")
      renderResponses(_.values(snapshot.val()));
    });
}

function renderResponses(responses) {
  _.each(responses, (r) => {
    var elm = $('<tr>');
    elm.append(renderTd(r.attending ? "Yes" : "No"));
    elm.append(renderTd(r.names.join("\n")));
    elm.append(renderTd(r.email));
    elm.append(renderTd(r.address));
    elm.append(renderTd(r.attending ? r.names.length : 0));
    elm.append(renderTd(r.note));
    $(responseTable).append(elm);
  });
}

function renderTd(text) {
  var td = $('<td>');
  td.text(text);
  return td;
}


/* Init */
$(document).ready(function() {
  $('.sign-out-link').click(signOut);
  postLogin.done(onLogin);
  firebase.auth().onAuthStateChanged(onAuthCheck);
});
