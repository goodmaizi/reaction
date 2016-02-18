Package.describe({
  name: 'scydev:reaction-p2p-marketplace-simplified-products',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Simplified products for sellers. Simplified checkout for buyers.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  // meteor base packages
  api.use("standard-minifiers");
  api.use("mobile-experience");
  api.use("meteor-base");
  api.use("mongo");
  api.use("blaze-html-templates");
  api.use("session");
  api.use("jquery");
  api.use("tracker");
  api.use("logging");
  api.use("reload");
  api.use("random");
  api.use("ejson");
  api.use("spacebars");
  api.use("check");

  api.use('ecmascript');
  api.use('templating');
  api.use("less");
  api.use("reactioncommerce:core@0.10.0");

  api.use("aldeed:template-extension");

  api.addFiles([
                'reaction-p2p-marketplace-simplified-products.js',
                'client/templates/products/productDetail/productDetailHideVariants.html',
                'client/templates/products/productDetail/productDetailHideVariants.js',
                'client/templates/cart/checkout/shipping/shipping.html',
                'client/templates/cart/checkout/shipping/shipping.js',
                'client/templates/cart/payment/methods/cod/cod.html',
                'client/templates/cart/payment/methods/cod/cod.js',
              ],
              'client'
              );

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('scydev:reaction-p2p-marketplace-simplified-products');
  api.addFiles('reaction-p2p-marketplace-simplified-products-tests.js');
});
