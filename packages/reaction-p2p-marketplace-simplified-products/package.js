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
  api.use('ecmascript');
  api.addFiles('reaction-p2p-marketplace-simplified-products.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('scydev:reaction-p2p-marketplace-simplified-products');
  api.addFiles('reaction-p2p-marketplace-simplified-products-tests.js');
});
