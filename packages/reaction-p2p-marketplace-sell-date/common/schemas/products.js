
// overriding product schema with extended version
ReactionCore.Schemas.Product = new SimpleSchema([
  ReactionCore.Schemas.Product, {
    "lastOrderDate": {
      type: Date,
      autoValue: function() {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      },
      optional: false
    },
    "lastOrderTime": {
      type: String,
      defaultValue: "08:00",
      optional: false
    },
    "forSaleOnDate": {
      type: Date,
      autoValue: function() {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      },
      optional: false
    },
    "pickupTimeFrom": {
      type: String,
      defaultValue: "12:00",
      optional: false
    },
    "pickupTimeTo": {
      type: String,
      defaultValue: "12:30",
      optional: false
    }
  }
]);
