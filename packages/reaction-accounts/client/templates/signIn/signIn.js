
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

/**
 * onCreated: Login form sign in view
 */
Template.loginFormSignInView.onCreated(() => {
  let template = Template.instance();

  template.uniqueId = Random.id();
  template.formMessages = new ReactiveVar({});
});

/**
 * Helpers: Login form sign in view
 */
Template.loginFormSignInView.helpers(LoginFormSharedHelpers);

/**
 * Events: Login form sign in view
 */
Template.loginFormSignInView.events({

  /**
   * Submit sign in form
   * @param  {Event} event - jQuery Event
   * @param  {Template} template - Blaze Template
   * @return {void}
   */
  "submit form": (event, template) => {
    event.preventDefault();

    let usernameInput = template.$(".login-input-email");
    let passwordInput = template.$(".login-input-password");

    let username = usernameInput.val().trim();
    let password = passwordInput.val().trim();

    let validatedEmail = LoginFormValidation.email(username);
    let validatedPassword = LoginFormValidation.password(password, {validationLevel: "exists"});

    let templateInstance = Template.instance();
    let errors = {};

    templateInstance.formMessages.set({});

    if (validatedEmail !== true) {
      errors.email = validatedEmail.reason;
    }

    if (validatedPassword !== true) {
      errors.password = validatedPassword.reason;
    }

    if ($.isEmptyObject(errors) === false) {
      templateInstance.formMessages.set({
        errors: errors
      });

      // prevent password reset
      return;
    }

    Meteor.loginWithPassword(username, password, (error) => {
      if (error) {
        // Show some error messages above the form fields
        console.log("login fail: ",error);
        let i18nKey = camelize(error.reason.replace(/[0-9]/g,'').replace(/\./g,'').replace(",", "").replace("'", "").replace("\"", "").replace("!", "").replace("?", "").replace("(", "").replace(")", ""));
        error.reason = i18next.t("accountsUI.error."+i18nKey);
        templateInstance.formMessages.set({
          alerts: [error]
        });
      } else {
        // Close dropdown or navigate to page
      }
    });
  }
});
