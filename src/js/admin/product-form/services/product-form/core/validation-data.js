const businessRules = {
  name: (value, context) => {
    const normalize = (str) => str.trim().toLowerCase();
    if (
      context.currentNameProductList.map(normalize).includes(normalize(value))
    ) {
      return {
        issue: {
          severity: "warning",
          message: `A product with this name already exists. Please confirm if your want to continue.`,
        },
      };
    }
    return null;
  },
};

function getWarningConsent(field) {
  const input = document.querySelector(`[data-field-input = ${field}]`);
  return input.dataset.warningConsent;
}

export function validateData({ data, currentNameProductList }, serviceContext) {
  const { inputValidators, productState, inputUIHandlerMaping } =
    serviceContext;
  const results = {
    isValid: true,
    inputs: {
      error: [],
      warning: [],
      valid: [],
    },
  };
  for (const key in data) {
    const value = data[key];
    const validationFn = inputValidators[key];
    const validationResult = validationFn(value);
    const severity = validationResult.issue?.severity;

    if (severity === "error") {
      results.inputs.error.push({ result: validationResult, field: key });
      results.isValid = false;
      continue;
    }

    const warningConsent = getWarningConsent(key) === "true";

    if (severity === "warning") {
      results.inputs.warning.push({
        result: validationResult,
        field: key,
        hasConfirm: warningConsent,
      });

      if (!warningConsent) results.isValid = false;
      continue;
    }

    const businessFn = businessRules[key];

    if (businessFn) {
      const businessResult = businessFn(value, {currentNameProductList});

      if (businessResult) {
        results.inputs.warning.push({
          result: businessResult,
          hasConfirm: warningConsent,
          field: key,
        });

        if (!warningConsent) results.isValid = false;
      } else {
        results.inputs.valid.push({
          result: validationResult,
          field: key,
        });
      }
      continue;
    }

    results.inputs.valid.push({
      result: validationResult,
      field: key,
    });
  }
  return results;
}
