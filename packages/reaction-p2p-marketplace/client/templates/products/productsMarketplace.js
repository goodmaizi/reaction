
Template.productsMarketplace.replaces("products");

Template.productsViewSwitcher.events({
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
});
