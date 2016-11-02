(function(ourStuff) {
  // The global jQuery object is passed as a parameter
  ourStuff(window.jQuery, window, document);

}(function($, window, document) {
// Our stuff goes here. Wrap everything in a function so it will load after the DOM is ready
  myMovies();

// Event listeners
  $(function() {
    $(document.body).on('click', '.remove-movie', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var confirmation = confirm("Really delete?");
      if (confirmation) {
        var removeMovieId = $(this).attr('data-target');
        removeMovie(removeMovieId);
      }
    })
  })

}));

function myMovies() {
  // Get a reference to the database service
  myMovies = firebase.database().ref('movies');

  // Get snapshot of the database
  myMovies.on("value",function(snapshot){
      if(snapshot.val() != null){
          post = snapshot.val(); // Object w/ all the movies
          console.log(post);
          var count = 0,
              title = snapshot.child('The Martian').key,
              moviesContainer = $("#catalogWrap");

          // Print all the movies in database
          snapshot.forEach(function(childSnapshot) {
            var title = childSnapshot.key,
                format = childSnapshot.child("format").val(),
                dvdType = childSnapshot.child("dvd-type").val(),
                wrapperDiv = '<div class="catalog-list" id="movie' + count + '">',
                titleWrapped = '<span class="movie-title">' + title + '</span>',
                formatWrapped = '<span class="movie-format">' + format + '</span>',
                removeLink = '<span class="remove-link-button"><a href="#" class="button remove-movie" data-target="movie' + count + '"><i class="fa fa-ban"></i> Remove</a>';

            if (format == 'DVD') {
              var dvdTypeWrapped = '<span class="movie-dvd-type">' + dvdType + '</span>';
            } else {
              var dvdTypeWrapped = '<span class="movie-dvd-type"></span>';
            }

            wrapperDiv += titleWrapped + formatWrapped + dvdTypeWrapped + removeLink + '</div>';

            $(moviesContainer).append(wrapperDiv);

            count += 1;

          })
      }
  });
}

function removeMovie(removeMovieId) {
  var removeMovieObject = $('#' + removeMovieId);
  var removeMovieTitle = $(removeMovieObject).children('.movie-title').html();
  firebase.database().ref().child('movies').child(removeMovieTitle).remove();
  location.reload();
}
