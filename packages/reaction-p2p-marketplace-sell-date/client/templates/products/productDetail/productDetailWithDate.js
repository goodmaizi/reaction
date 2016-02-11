
//Template.productDetailWithDate.replaces("productDetail"); // not even necessary to act on the event below

Template.productDetail.rendered = function() {
  // inject date field template here
  console.log("HUMPPA");
  Blaze.renderWithData(Template.productDetailDateField, this.data, $(".product-location")[0])
};
