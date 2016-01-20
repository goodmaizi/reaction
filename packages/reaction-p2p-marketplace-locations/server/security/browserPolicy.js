Meteor.startup(function() {
  BrowserPolicy.content.allowOriginForAll("*.googleapis.com");
  BrowserPolicy.content.allowOriginForAll("*.gstatic.com");
  return BrowserPolicy.content.allowOriginForAll("maps.googleapis.com");
});
