
if (Template.codPaymentForm) {
  Template.codPaymentForm.onRendered(
    function() {
      $("#reaction-cod > h4 > div > span").trigger("click");
      console.log("clicked CoD");

      $("#reaction-cod").hide();
      $("#reaction-paymentmethod").hide();

      $("#btn-complete-order").html("Complete order");
      console.log("renamed CoD button");
    }
  );
}
