
//Template.productDetailWithDate.replaces("productDetail"); // not even necessary to act on the event below

Template.productDetail.onRendered(
  function() {
    if ($('#forSaleOnDate').length === 0) { // make sure its only injected once, not on every rendered event
      // inject date field template here
      Blaze.renderWithData(Template.productDetailDateField, this.data, $(".pdp-right-column")[0])
      console.log('injected date field');
    }
  }
);
