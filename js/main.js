$("#open-nav").click(function() {
  $("#main-nav").fadeIn(200);
  $(this).fadeOut(200);
  return false;
})

$("#close-nav").click(function() {
  $("#main-nav").fadeOut(200);
  $("#open-nav").fadeIn(200);
  return false;
})
