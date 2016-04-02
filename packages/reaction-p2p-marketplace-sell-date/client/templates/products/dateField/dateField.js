
// inherit helpers from template productDetail so we can use fieldComponent in this here template

Template.productDetailDateField.inheritsHelpersFrom(["productDetail", "productDetailEdit"]);
Template.productDetailDateField.inheritsEventsFrom(["productDetail", "productDetailEdit"]);
Template.productDetailDateField.inheritsHooksFrom(["productDetail", "productDetailEdit"]);

Template.productDetailDateField.onRendered(
  function() {
    Meteor.setTimeout(function() { // what the?!? document doesn't seem to be ready immediately when this event is fired...
      $(".forSaleOnDate-edit-input").datepicker({
        format: "dd.mm.yyyy"
      });

      $('.datetimepicker').datetimepicker({
        format: "DD.MM.YYYY hh:mm", //
        //sideBySide: true
      });
      //$('.datetimepicker').data("DateTimePicker").change(function(event) {
      $('.datetimepicker').on("dp.change", function(event) {
        console.log("datetimepicker changed");
        $('.latestOrderDate-edit-input').val(event.date.format("DD.MM.YYYY hh:mm"));
        $('.latestOrderDate-edit-input').trigger("change");
      });
      // set date from real input field
      $('.latestOrderDate-dummy-input').val($('.latestOrderDate-edit-input').val());

      console.log("activated datepicker");
    }, 100);
  }
);

Template.productDetailDateField.helpers(
  {
    prettifyDate: function(inDate) {
      //return new Date(inDate).toString('dd.mm.yyyy')
      return moment(new Date(inDate)).format('DD.MM.YYYY');
    },
    prettifyDateTime: function(inDate) {
      //return new Date(inDate).toString('dd.mm.yyyy')
      return moment(new Date(inDate)).format('DD.MM.YYYY hh:mm');
    }
  }
);
