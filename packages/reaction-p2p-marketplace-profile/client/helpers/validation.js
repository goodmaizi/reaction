
window.ProfileFormValidation = {
  name: function(name) {
    // Valid
    if (name.length >= 3) {
      return true;
    }

    // Invalid
    return {
      "error": "INVALID_NAME",
      "reason": i18n.t('accountsUI.error.usernameTooShort')
    };
  },
  description: function(description) {
    // Valid
    if (description.length <= 1000) {
      return true;
    }

    // Invalid
    return {
      "error": "INVALID_DESCRIPTION",
      "reason": i18n.t('accountsUI.error.invalidDescription')
    };
  },
};
