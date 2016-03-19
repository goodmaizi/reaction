/**
 * productImageGallery helpers
 */

let Media = ReactionCore.Collections.Media;

/**
 * uploadHandler method
 */
function uploadHandler(event) {
  let shopId = ReactionCore.getShopId();
  let userId = Meteor.userId();
  let count = Media.find({
    "metadata.userId": userId
  }).count();
  // TODO: we need to mark the first variant images somehow for productGrid.
  // But how do we know that this is the first, not second or other variant?
  // Question is open. For now if product has more than 1 top variant, everyone
  // will have a chance to be displayed
  const toGrid = 1;

  return FS.Utility.eachFile(event, function (file) {
    let fileObj;
    fileObj = new FS.File(file);
    fileObj.metadata = {
      ownerId: userId,
      userId: userId,
      shopId: shopId,
      priority: count,
      toGrid: +toGrid // we need number
    };
    Media.insert(fileObj);
    return count++;
  });
}

/**
 * updateImagePriorities method
 */
function updateImagePriorities() {
  const sortedMedias = _.map($(".gallery").sortable("toArray", {
    attribute: "data-index"
  }), function (index) {
    return {
      mediaId: index
    };
  });

  const results = [];
  for (let image of sortedMedias) {
    results.push(Media.update(image.mediaId, {
      $set: {
        "metadata.priority": _.indexOf(sortedMedias, image)
      }
    }));
  }
  return results;
}

/**
 *  Product Image Gallery
 */

Template.profileImageGallery.helpers({
  media: function (userId) {
    let mediaArray = [];
    userId = userId.hash.userId;

    let profileUser;
    if (userId) {
      //profileUser = Meteor.users.findOne({_id: userId});
      ReactionCore.Subscriptions.ProfileUser = ReactionSubscriptions.subscribe("ProfileUser", userId);
      if (ReactionCore.Subscriptions.ProfileUser.ready()) {
        profileUser = Meteor.users.findOne({_id: userId});
      }
    }
    else {
      profileUser = Meteor.user();
    }
    console.log("Template.profileImageGallery.helpers.media() userId: ",userId," profileUser: %o", profileUser);

    if (profileUser.profile) {
      mediaArray = Media.find({
        "metadata.userId": profileUser._id
      }, {
        sort: {
          "metadata.priority": 1
        }
      });
    }
    return mediaArray;
  },
  profile: function (userId) {
    let profileUser;
    if (userId) {
      profileUser = Meteor.users.find({_id: userId});
    }
    else {
      profileUser = Meteor.user();
    }
    console.log("Template.profileImageGallery.helper: %o", profileUser);

    return profileUser.profile;
  }
});

/**
 * productImageGallery onRendered
 */

Template.profileImageGallery.onRendered(function () {
  return this.autorun(function () {
    let $gallery;
    $gallery = $(".gallery");
    return $gallery.sortable({
      cursor: "move",
      opacity: 0.3,
      placeholder: "sortable",
      forcePlaceholderSize: true,
      update: function () {
        let profile = Meteor.user().profile;
        profile.medias = [];
        return updateImagePriorities();
      },
      start: function (event, ui) {
        ui.placeholder.html("Drop image to reorder");
        ui.placeholder.css("padding-top", "30px");
        ui.placeholder.css("border", "1px dashed #ccc");
        return ui.placeholder.css("border-radius", "6px");
      }
    });
  });
});

/**
 * productImageGallery events
 */

Template.profileImageGallery.events({
  "click .gallery > li": function (event) {
    event.stopImmediatePropagation();
    let first = $(".gallery li:nth-child(1)");
    let target = $(event.currentTarget);
    if ($(target).data("index") !== first.data("index")) {
      return $(".gallery li:nth-child(1)").fadeOut(400, function () {
        $(this).replaceWith(target);
        first.css({
          display: "inline-block"
        }).appendTo($(".gallery"));
        return $(".gallery li:last-child").fadeIn(100);
      });
    }
  },
  "click .remove-image": function () {
    this.remove();
    updateImagePriorities();
  },
  "dropped #galleryDropPane": uploadHandler
});

/**
 * imageUploader events
 */

Template.profileImageUploader.events({
  "click #btn-upload": function () {
    return $("#files").click();
  },
  "change #files": uploadHandler,
  "dropped #dropzone": uploadHandler
});

/**
 * productImageGallery events
 */

Template.profileImageGallery.events({
  "click #img-upload": function () {
    return $("#files").click();
  },
  "load .img-responsive": function (event, template) {
    return Session.set("variantImgSrc", template.$(".img-responsive").attr(
      "src"));
  }
});
