
/**
 * onCreated: Login form sign up view
 */
Template.loginFormSignUpView.onCreated(() => {
  let template = Template.instance();

  template.uniqueId = Random.id();
  template.formMessages = new ReactiveVar({});
  template.type = "signUp";
});

/**
 * Helpers: Login form sign up view
 */
Template.loginFormSignUpView.helpers(LoginFormSharedHelpers);

/**
 * Events: Login form sign up view
 */
Template.loginFormSignUpView.events({
  /**
   * Submit sign up form
   * @param  {Event} event - jQuery Event
   * @param  {Template} template - Blaze Template
   * @return {void}
   */
  "submit form": function (event, template) {
    event.preventDefault();

    // var usernameInput = template.$(".login-input--username");
    let emailInput = template.$(".login-input-email");
    let passwordInput = template.$(".login-input-password");
    let isSellerInput = template.$(".login-input-isSeller").prop('checked') && template.$(".login-input-isSeller").val().trim() == "on";
    let nameInput = template.$(".login-input-name");

    let email = emailInput.val().trim();
    let password = passwordInput.val().trim();
    let isSeller = isSellerInput;
    let name = nameInput.val().trim();

    let validatedEmail = LoginFormValidation.email(email);
    let validatedPassword = LoginFormValidation.password(password);
    let validatedIsSeller = LoginFormValidation.isSeller(isSeller);
    let validatedName = LoginFormValidation.name(name);

    let templateInstance = Template.instance();
    let errors = {};

    templateInstance.formMessages.set({});

    if (validatedEmail !== true) {
      errors.email = validatedEmail.reason;
    }

    if (validatedPassword !== true) {
      errors.password = validatedPassword;
    }

    if (validatedIsSeller !== true) {
      errors.isSeller = validatedIsSeller.reason;
    }

    if (validatedName !== true) {
      errors.name = validatedName.reason;
    }

    if ($.isEmptyObject(errors) === false) {
      templateInstance.formMessages.set({
        errors: errors
      });
      // prevent signup
      return;
    }

    ReactionCore.Log.info("submit form isSeller -", isSeller, "- ", "was -", isSellerInput, "-");
    console.log("submit form isSeller -", isSeller, "- ");

    let newUserData = {
      // username: username,
      email: email,
      password: password,
      isSeller: isSeller,
      profile: {
        //firstName: "WAKKA",
        name: name,
        //isSeller: isSeller
      }
    };

    Accounts.createUser(newUserData, function (error) {
      if (error) {
        // Show some error message
        templateInstance.formMessages.set({
          alerts: [error]
        });
      } else {
        // Close dropdown or navigate to page
      }
    });
  }
});
