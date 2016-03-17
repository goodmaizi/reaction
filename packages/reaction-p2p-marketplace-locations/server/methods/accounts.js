/*
function resolveAddressToLatLong(address) {
  console.log("HOOK: accounts/addressBookUpdate");
  ReactionCore.Log.info("HOOK: accounts/addressBookUpdate");

}

// hook into: "accounts/addressBookAdd": function (address, accountUserId)
ReactionCore.MethodHooks.after("accounts/addressBookAdd",
  function(options) {
    var address = options.arguments[0];
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
);*/

Meteor.methods(
  {
    "accounts/getUserAddress": function (userId) {
      check(userId, String);

      let account =  ReactionCore.Collections.Accounts.findOne({userId: userId});
      //ReactionCore.Log.info("User address book: ",account.profile.addressBook);

      if (account != null && account.profile.addressBook != null && account.profile.addressBook.length > 0) {
        let address = account.profile.addressBook[0];
        let addressString = address.address1+" "+address.address2+", "+address.postal+" "+address.city+", "+address.country

        ReactionCore.Log.info("User address string: ",addressString);
        return addressString;
      }

      return null;
    },
  }
);
