const INPUT_FIELDS = [
  "name",
  "price",
  "image",
  "screen",
  "backCamera",
  "frontCamera",
  "desc",
  "type",
  "stock",
  "status",
];

export function initWarningConsentCheckboxEvent({ inputUIHandlerMapping }) {
  INPUT_FIELDS.forEach((field) => {
    const warningConsentCheckbox = document.querySelector(
      `[data-role="warning-consent-checkbox"][data-field ="${field}"]`,
    );
    const fieldInput = document.querySelector(`[data-field-input="${field}"]`);

    warningConsentCheckbox.checked =
      fieldInput.dataset.warningConsent === "true";

    warningConsentCheckbox.addEventListener("change", () => {
      fieldInput.dataset.warningConsent =
        warningConsentCheckbox.checked.toString();

      if (fieldInput.dataset.warningConsent) {
        setTimeout(() => {
          inputUIHandlerMapping[field].hideWarningMessage(field);
          inputUIHandlerMapping[field]?.resetInputValidationState?.(field);
        }, 300);
      }
    });
  });
}
