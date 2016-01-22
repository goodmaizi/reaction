/**
 * productMap helpers
 */

Template.productMap.onRendered(function() {
  GoogleMaps.load();
});

let Media;
Media = ReactionCore.Collections.Media;
Template.productMap.helpers({
  products: function () {
    return getProductsByTag(this.tag);
  },
  media: function () {
    let defaultImage;
    let variants = [];
    for (let variant of this.variants) {
      if (!variant.parentId) {
        variants.push(variant);
      }
    }
    if (variants.length > 0) {
      let variantId = variants[0]._id;
      defaultImage = Media.findOne({
        "metadata.variantId": variantId,
        "metadata.priority": 0
      });
    }
    if (defaultImage) {
      return defaultImage;
    }
    return false;
  },
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(47.3770309, 8.5077843), // start pos zürich 47.3770309,8.5077843
        zoom: 13,
        reactionTag: this.tag
      };
    }
  }
});

Template.productMap.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('map', function(map) {
    // Add a marker to the map once it's ready
    //var markerIcon = image = "http://gmaps-samples.googlecode.com/svn/trunk/markers/blue/blank.png";
    /*
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance,
      title: "Demo Marker: Wos zum essn'",
      //icon: markerIcon
    });*/

    // tag is not available in onCreated event by this.tag, so we get it through mapOptions helper
    prodLocations = getProductsByTag(map.options.reactionTag);
    prodLocations.forEach(function(prodLocation){
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(prodLocation.latitude, prodLocation.longitude),
        map: map.instance,
        title: prodLocation.title,
        //icon: markerIcon
      });
    });

    google.maps.event.addListener(map.instance, 'click', function(event) {
      ReactionCore.Collections.MapMarkers.insert({ latitude: event.latLng.lat(), longitude: event.latLng.lng() });
    });

    var markers = {};

    ReactionCore.Collections.MapMarkers.find().observe({
      added: function(document) {
        // Create a marker for this document
        var marker = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.latitude, document.longitude),
          map: map.instance,
          // We store the document _id on the marker in order
          // to update the document within the 'dragend' event below.
          id: document._id
        });

        // This listener lets us drag markers on the map and update their corresponding document.
        google.maps.event.addListener(marker, 'dragend', function(event) {
          ReactionCore.Collections.MapMarkers.update(marker.id, { $set: { latitude: event.latLng.lat(), longitude: event.latLng.lng() }});
        });

        // Store this marker instance within the markers object.
        markers[document._id] = marker;
      },
      changed: function(newDocument, oldDocument) {
        markers[newDocument._id].setPosition({ latitude: newDocument.latitude, longitude: newDocument.longitude });
      },
      removed: function(oldDocument) {
        // Remove the marker from the map
        markers[oldDocument._id].setMap(null);

        // Clear the event listener
        google.maps.event.clearInstanceListeners(
          markers[oldDocument._id]);

        // Remove the reference to this marker instance
        delete markers[oldDocument._id];
      }
    });

  });
});
