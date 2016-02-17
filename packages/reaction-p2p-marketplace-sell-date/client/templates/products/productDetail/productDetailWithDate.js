
//Template.productDetailWithDate.replaces("productDetail"); // not even necessary to act on the event below
var existingRenderedCallback = Template.productDetail.rendered;
Template.productDetail.rendered = function() {
  if (existingRenderedCallback != null) existingRenderedCallback();

  // inject date field template here
  Blaze.renderWithData(Template.productDetailDateField, this.data, $(".pdp-right-column")[0])
  console.log('injected date field');
};
