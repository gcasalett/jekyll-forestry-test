(function(ourStuff) {
  // The global jQuery object is passed as a parameter
  ourStuff(window.jQuery, window, document);

}(function($, window, document) {
  // Our stuff goes here. Wrap everything in a function so it will load after the DOM is ready
  parseUrl();

}));

function parseUrl() {
  var urlString = location.search.substring(1);
  var movieObject = JSON.parse('{"' + decodeURI(urlString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replace(/\+/g, ' ').replace(/%3A/g, ':') + '"}')
  pushToDatabase(movieObject);
}

function pushToDatabase(movieObject) {
  // Initialize firebase connection
  var newMovieTitle = movieObject['title'];
  var newMovieKey = firebase.database().ref().child('movies').child(newMovieTitle).push().key;
  $('#addedMovieTitle').append(newMovieTitle)

  return firebase.database().ref().child('movies').child(newMovieTitle).update(movieObject);
}
