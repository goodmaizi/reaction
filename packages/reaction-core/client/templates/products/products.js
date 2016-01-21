/**
 * products events
 */

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
    return $(".product-map").show();
  },
  "click .product-list-item": function () {
    return Router.go("product", {
      _id: this._id
    });
  }
});
