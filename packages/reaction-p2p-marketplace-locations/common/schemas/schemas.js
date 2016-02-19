
/*
ReactionCore.Schemas.SocialProvider = new SimpleSchema({
  profilePage: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    label: 'Profile Page',
    optional: true
  },
  enabled: {
    type: Boolean,
    defaultValue: false,
    optional: true
  }
});*/

ReactionCore.Schemas.LocationsPackageConfig = new SimpleSchema([
  ReactionCore.Schemas.PackageConfig, {
    "settings.public": {
      type: Object,
      optional: true
    },
    "settings.public.apps": {
      type: Object,
      label: "Locations Settings",
      optional: true
    },
    "settings.public.apps.locations.sellers": {
      type: Boolean,
      defaultValue: true,
      optional: true
    },
    "settings.public.apps.locations.products": {
      type: Boolean,
      defaultValue: true,
      optional: true
    },
    /*
    "settings.public.apps.twitter": {
      type: ReactionCore.Schemas.SocialProvider,
      optional: true
    },*/
    "settings.public.apps.locations.test": {
      type: String,
      optional: true
    },

  }
]);
