
// overriding product schema with extended version
ReactionCore.Schemas.Product = new SimpleSchema([
  ReactionCore.Schemas.Product, {
    "forSaleOnDate": {
      type: Date,
      //defaultValue: true,
      autoValue: function () {
        return new Date;
      },
      optional: false
    },
  }
]);
