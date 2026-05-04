function clearNonErrorMessages({ valid }, inputUIHandlerMapping, formUI) {
  valid.forEach(({ field }) => {
    const handler = inputUIHandlerMapping[field];
    if (!handler) return;
    inputUIHandlerMapping[field].resetValidationMessage(field);
    formUI.resetConsentField(field);
  });
}

function showValidationMessage(field, issue, inputUIHandlerMapping) {
  const handler = inputUIHandlerMapping[field];
  if (!handler) return;
  inputUIHandlerMapping[field].hideWarningMessage(field);
  inputUIHandlerMapping[field].renderValidationMessage(field, issue);
}

export function syncValidationUI(results, { inputUIHandlerMapping, formUI }) {
  const { inputs } = results;

  clearNonErrorMessages(inputs, inputUIHandlerMapping, formUI);

  const merged = [
    ...inputs.error.map((item) => ({ ...item, hasConfirm: false })),
    ...inputs.warning,
  ];
  merged.forEach(({ field, result: { issue }, hasConfirm }) => {
    if (hasConfirm) return;
    showValidationMessage(field, issue, inputUIHandlerMapping);
  });
}
