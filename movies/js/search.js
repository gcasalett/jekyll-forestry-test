(function(ourStuff) {
  // The global jQuery object is passed as a parameter
  ourStuff(window.jQuery, window, document);

}(function($, window, document) {
  // Our stuff goes here. Wrap everything in a function so it will load after the DOM is ready
  searchMovies();
  toggleDVDType();

// Event listeners
  // Add movie
  $(function() {
    $(document.body).on('click', '.add-movie', function(e) { // This works because the buttons are dynamically generated: http://stackoverflow.com/questions/15090942/jquery-event-handler-not-working-on-dynamic-content
      e.stopPropagation();
      var buttonId = $(this).attr('data-target');
      console.log(buttonId);
      addMovie(buttonId);
    });

    $("#format").change(function() {
      toggleDVDType();
    });
  })

  // Toggle synopsis
  $(function() {
    $(document.body).on('click', '#showSynopsisButton', function(e) {
      e.preventDefault();
      e.stopPropagation();
      // Close others
      $(this).parent().parent().siblings().children('.movie-synopsis').slideUp();

      // Rotate icon
      $(this).children('.fa-caret-down').toggleClass('fa-rotate-180');
      var whichMovie = $(this).attr('data-toggle');
      var synopsisBlock = $('#synopsis' + whichMovie);
      $(synopsisBlock).slideToggle();
    })
  })

  function toggleDVDType() {
    if ($('#format').val() == 'DVD')
        $('.dvd-type-field').show();
    else {
        $('.dvd-type-field').hide();
    }
  }

}));

// Gets movies from The Movie DB based on the search query
function searchMovies() {
  var request = new XMLHttpRequest(),
      api_key = 'a448c66145399f9b9215224c48893ec9',
      raw_query = window.location.search.split('=');
      query = raw_query[1];
      full_url = 'http://api.themoviedb.org/3/search/multi?api_key=' + api_key + '&query=' + query;

  // Print query on title
  var searchQuery = '&ldquo;' + query.split("+").join(" ") + '&rdquo;';
  $('span.search-results-title').append(searchQuery);

  request.open('GET', full_url);
  request.setRequestHeader('Accept', 'application/json');
  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      var response = this.responseText;
      var searchResults = JSON.parse(response);

      printResults(searchResults);
    }
  };

  // This function goes through the results and prints them
  function printResults(searchResults) {
    var globalCounter = 0,
        resultsContainer = $('#results');
        resultsCount = searchResults.results.length;

    for (var i = 0; i < resultsCount; i++) {
        var wrapperDiv = '<div class="search-result" id="' + i +'">',
            type = '<span class="media-type">' + searchResults.results[i].media_type + '</span>',
            showOverview = '<span class="button-wrap"><a href="#" class="button" id="showSynopsisButton" data-toggle="' + i + '"><i class="fa fa-film"></i>&nbsp;&nbsp;Synopsis&nbsp;&nbsp;<i class="fa fa-caret-down"></i></a></span>',
            overview = '<span class="movie-synopsis" id="synopsis' + i + '">' + searchResults.results[i].overview + '</span>',
            addLink = '<span class="button-wrap"><a href="#addMovie" class="button add-movie" id="addMovieButton" data-target="' + i + '"><i class="fa fa-plus"></i>&nbsp;&nbsp;Add movie</a></span>';

        if (searchResults.results[i].media_type === 'movie' ) {
          title = '<span class="movie-title">' + searchResults.results[i].title + '</span>',
          released = '<span class="movie-release-date">' + searchResults.results[i].release_date + '</span>';

        } else if (searchResults.results[i].media_type === 'tv') { // get shows only
          title = '<span class="movie-title">' + searchResults.results[i].name + '</span>',
          released = '<span class="movie-release-date">' + searchResults.results[i].first_air_date + '</span>';
        }

        wrapperDiv += title +  type +  released + showOverview + addLink + overview;
        $(resultsContainer).append(wrapperDiv);
    }
  }

  request.send();
  return false;
}

function addMovie(buttonId) {
// Get movie info from row using the row's ID
  // Asign existing values to modal form
  var selectedRow = $("#" + buttonId),
      newMovieTitle = selectedRow.children('.movie-title').html(),
      newMovieType = selectedRow.children('.media-type').html(),
      newMovieReleased = selectedRow.children('.movie-release-date').html(),
      newMovieDateAdded = getCurrentDate();

  // Pass info from rows to autopopulate form
  $('#newMovieDateAdded').attr('value', newMovieDateAdded);
  $('#newMovieTitle').attr('value', newMovieTitle);
  $('#newMovieType').attr('value', newMovieType);
  $('#newMovieReleased').attr('value', newMovieReleased);
}

function getCurrentDate() {
  var fullDate = new Date()
  console.log(fullDate);
  //Thu Otc 15 2014 17:25:38 GMT+1000 {}

  //convert month to 2 digits
  var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) :(fullDate.getMonth()+1);

  var currentDate = fullDate.getFullYear() + "-" + twoDigitMonth + "-" + fullDate.getDate();
  return currentDate;
}
