
Template.productDetail.onRendered(
  function() {
    if ($('.product-detail-map').length === 0) { // make sure its only injected once, not on every rendered event
      Meteor.setTimeout(function() { // what the?!? document doesn't seem to be ready immediately when this event is fired...
        // inject date field template here
        Blaze.renderWithData(Template.productDetailLocationField, this.data, $(".pdp-right-column")[0])
        console.log('injected location field');

        // always show the map on product detail
        $(".map-container").css({ opacity: 1.0 });
      }, 100);
    }
  }
);
