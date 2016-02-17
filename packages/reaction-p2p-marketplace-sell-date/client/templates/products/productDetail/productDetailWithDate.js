
//Template.productDetailWithDate.replaces("productDetail"); // not even necessary to act on the event below

Template.productDetail.onRendered(
  function() {
    // inject date field template here
    Blaze.renderWithData(Template.productDetailDateField, this.data, $(".pdp-right-column")[0])
    console.log('injected date field');
  }
);
