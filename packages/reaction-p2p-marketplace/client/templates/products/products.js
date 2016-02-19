
Template.products.onRendered(
  function() {
    if ($('.viewSwitch').length === 0) { // make sure its only injected once, not on every rendered event
      // inject template here
      Blaze.renderWithData(Template.searchBox, this.data, $(".container-main")[0], $('.product-grid')[0])
      Blaze.renderWithData(Template.productsViewSwitcher, this.data, $(".container-main")[0], $('.product-grid')[0])
      Blaze.renderWithData(Template.productList, this.data, $(".container-main")[0])
      console.log('injected view switcher');
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
});
