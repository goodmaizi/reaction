
// inherit helpers from template productDetail so we can use fieldComponent in this here template

function initDatepickers() {

  // api.use("rajit:bootstrap3-datepicker-de"); didn't change anything, so we define DE here
	$.fn.datepicker.dates['de'] = {
		days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
		daysShort: ["Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam"],
		daysMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
		months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
		monthsShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
		today: "Heute",
		monthsTitle: "Monate",
		clear: "Löschen",
		weekStart: 1,
		format: "dd.mm.yyyy"
	};

  $(".forSaleOnDate-edit-input").datepicker({
    format: "dd.mm.yyyy",
    language: "de"
  });

  $('.datetimepicker').datetimepicker({
    format: "DD.MM.YYYY hh:mm", //
    locale: moment.locale("de"),
    //sideBySide: true
  });

  $('.datetimepicker').on("dp.change", function(event) {
    console.log("datetimepicker changed: ",event.date);
    let fixedDatetime = event.date.subtract(2, 'hours'); // for some reason the event.date is 2 hours diffwerent from what we choose and see in the input field
    $('.latestOrderDate-edit-input').val(fixedDatetime.format("DD.MM.YYYY hh:mm"));
    $('.latestOrderDate-edit-input').trigger("change");
  });
  // set date from real input field
  $('.latestOrderDate-dummy-input').val($('.latestOrderDate-edit-input').val());

  console.log("activated datepicker");
}

Template.productDetailDateField.inheritsHelpersFrom(["productDetail", "productDetailEdit"]);
Template.productDetailDateField.inheritsEventsFrom(["productDetail", "productDetailEdit"]);
Template.productDetailDateField.inheritsHooksFrom(["productDetail", "productDetailEdit"]);

Template.productDetailDateField.onCreated(
  function() {
    Template.instance().autorun(function() {
      //initDatepickers();
    });
  }
);

Template.productDetailDateField.onRendered(
  function() {
    Meteor.setTimeout(function() { // what the?!? document doesn't seem to be ready immediately when this event is fired...
      initDatepickers();
    }, 100);
    Meteor.setTimeout(function() { // what the?!? document doesn't seem to be ready immediately when this event is fired...
      initDatepickers();
    }, 1000);
    Meteor.setTimeout(function() { // what the?!? document doesn't seem to be ready immediately when this event is fired...
      initDatepickers();
    }, 2000);
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
