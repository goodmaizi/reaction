
Template.locationFieldDisplay.onCreated(function() {
  this.locationForProduct = new ReactiveVar("");
  //console.log("created ReactiveVar locationForProduct");
});

Template.registerHelper("locationForProduct", function (product) {
  //console.log("locationForProduct() product: ",product);
  let templateInstance = Template.instance();

  Meteor.call("accounts/getUserAddress", product.userId, function(error, result) {
    //console.log("accounts/getUserAddress() result: ",result," error: ",error);
    templateInstance.locationForProduct.set(result.replace("undefined", "").replace("  ", " "));
  });

  return Template.instance().locationForProduct.get();
});
