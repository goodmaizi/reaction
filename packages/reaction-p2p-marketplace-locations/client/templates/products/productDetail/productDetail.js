
Template.productDetail.onRendered(
  function() {
    if ($('.product-detail-map').length === 0) { // make sure its only injected once, not on every rendered event
      // inject date field template here
      Blaze.renderWithData(Template.productDetailLocationField, this.data, $(".pdp-right-column")[0])
      console.log('injected location field');
    }
  }
);
