/**
* Collections Templates
*/
//ReactionCore.Collections.ProductDates = new Mongo.Collection("ProductDates");
//ReactionCore.Collections.ProductDates.attachSchema(ReactionCore.Schemas.ProductDate);

/*
ReactionCore.Collections.Products = new Mongo.Collection("ProductDates");
ReactionCore.Collections.Products.attachSchema(ReactionCore.Schemas.ProductDate);
*/

// overriding Products collection set by reaction core
ReactionCore.Collections.Products.attachSchema(ReactionCore.Schemas.ProductDate, {replace: true});
