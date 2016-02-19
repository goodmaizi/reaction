
function resolveAddressToLatLong(address) {
  console.log("HOOK: accounts/addressBookUpdate");
  ReactionCore.Log.info("HOOK: accounts/addressBookUpdate");

}

// hook into: "accounts/addressBookAdd": function (address, accountUserId)
ReactionCore.MethodHooks.after("accounts/addressBookAdd",
  function(options) {
    var address = options.arguments[0];
    /*
    // options.arguments is an array that carries all params on the original method.
    // For example with `orders/orderCompleted` the order param is the first (and only) param.
    var address = options.arguments[0];
    var accountUserId = options.arguments[1];
    var type = options.arguments[2];

    console.log('Results:', options.result); //Result of orderCompleted method
    console.log('Error:', options.error); // original method Error or `undefined` if successful
    console.log('arguments[0]:', address); // first param from original method (order object in this case)
    console.log('hooksProcessed:', options.hooksProcessed); // Tracker that looks at amount times result was modified previously
    */
    resolveAddressToLatLong(address);

    // To be safe, return the options.result in an after hook.
    return options.result;
  }
);
// hook into: "accounts/addressBookUpdate": function (address, accountUserId, type)
ReactionCore.MethodHooks.after("accounts/addressBookUpdate",
  function(options) {
    var address = options.arguments[0];
    resolveAddressToLatLong(address);

    // To be safe, return the options.result in an after hook.
    return options.result;
  }
);
