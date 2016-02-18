
// overriding product schema with extended version
ReactionCore.Schemas.Product = new SimpleSchema([
  ReactionCore.Schemas.Product, {
    "forSaleOnDate": {
      type: Date,
      //defaultValue: true,
      optional: false
    },
  }
]);
