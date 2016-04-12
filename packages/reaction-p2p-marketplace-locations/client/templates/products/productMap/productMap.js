
Template.productMap.inheritsHelpersFrom(["productGrid"]);
Template.productMap.inheritsEventsFrom(["productGrid"]);
Template.productMap.inheritsHooksFrom(["productGrid"]);


Template.productMap.onRendered(function() {
  GoogleMaps.load();
});

let Media;
Media = ReactionCore.Collections.Media;
Template.productMap.helpers({
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

var markers = {};

function addMarker(map, product) {
  Meteor.call("accounts/getUserAddress", product.userId, function(error, result) {
      let address = result;
      console.log('address', address);

      var geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          'address': address
        },
        function(results, status) {
           if(status == google.maps.GeocoderStatus.OK) {
              console.log("resolved location: "+results[0].geometry.location);

              var infowindow = new google.maps.InfoWindow({
                content: "OLO" //contentString
              });

              var marker = new google.maps.Marker({
                 position: results[0].geometry.location,
                 map: map.instance,
                 title: product.title,
                 animation: google.maps.Animation.DROP,
                 icon: getProductImage(product._id).url({store: "thumbnail"})
              });
              marker.addListener('click', function() {
                infowindow.open(map, this);
              });

              markers[product._id] = marker;

              //map.instance.setCenter(results[0].geometry.location);
           }
        }
      );

    }
  );
}

function getProductImage(productId) {
  const media = ReactionCore.Collections.Media.findOne({
    "metadata.productId": productId,
    //"metadata.priority": 0,
    //"metadata.toGrid": 1
  }, { sort: { uploadedAt: 1 } });

  //console.log("media for product ",productId," ",media);
  //console.log("thumbnail for product ",productId," ",media.getCopyInfo("thumbnail"));

  return media;// instanceof FS.File ? media : false;
}

Template.productMap.onCreated(function() {
  // copied from productGrid

  Session.set("productGrid/selectedProducts", []);
  // Update product subscription
  this.autorun(() => {
    const slug = ReactionRouter.getParam("slug");
    const { Tags } = ReactionCore.Collections;
    const tag = Tags.findOne({ slug: slug }) || Tags.findOne(slug);
    let tags = {}; // this could be shop default implementation needed
    if (tag) {
      tags = {tags: [tag._id]};
    }

    let dateFilter = { forSaleOnDate: Session.get('productFilters/forSaleOnDate') }
    if (dateFilter.forSaleOnDate == null || dateFilter.forSaleOnDate.toString() == "Invalid Date") {
      dateFilter = {};
    }
    let locationFilter = { location: Session.get('productFilters/location') }
    if (locationFilter.location == null || locationFilter.location.trim() == "") {
      locationFilter = {};
    }

    const queryParams = Object.assign({}, tags, ReactionRouter.current().queryParams, dateFilter, locationFilter);
    Meteor.subscribe("Products", Session.get("productScrollLimit"), queryParams);
  });

  this.autorun(() => {
    const isActionViewOpen = ReactionCore.isActionViewOpen();
    if (isActionViewOpen === false) {
      Session.set("productGrid/selectedProducts", []);
    }
  });


  GoogleMaps.ready('map', function(map) {
    ReactionCore.Collections.Products.find().observe({
      added: function(product) {
        // Create a marker for this document
        addMarker(map, product);
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
