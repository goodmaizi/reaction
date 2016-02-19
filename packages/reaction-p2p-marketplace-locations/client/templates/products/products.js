
Template.products.onRendered(
  function() {
    if ($('.product-map').length === 0) { // make sure its only injected once, not on every rendered event
      // inject template here
      Blaze.renderWithData(Template.productMap, this.data, $(".container-main")[0])
      console.log('injected map');
    }
  }
);

Template.products.events({
  "click #productListView": function () {
    $(".product-grid").hide();
    $(".product-map").hide();
    return $(".product-list").show();
  },
  "click #productGridView": function () {
    $(".product-list").hide();
    $(".product-map").hide();
    return $(".product-grid").show();
  },
  "click #productMapView": function () {
    $(".product-list").hide();
    $(".product-grid").hide();
    $(".map-container").css({ opacity: 1.0 }); // map was hidden with opacity, because with display:none; it wouldn't load contents
    return $(".product-map").show();
  },
  "click .product-list-item": function () {
    return Router.go("product", {
      _id: this._id
    });
  }
});
