const ERROR_MESSAGE_SEVERITY_CLASSES = {
  warning: ["bg-orange-50", "text-orange-700", "border-orange-200", "border-l-4","indent-4" ],
  error: ["bg-red-50", "text-red-700", "border-red-200", "border-l-4"],
};

const ALL_ERROR_MESSAGE_SEVERITY_CLASSES = Object.values(
  ERROR_MESSAGE_SEVERITY_CLASSES,
).flat();
export function renderValidationMessage(field, issue) {
  const messageField = document.querySelector(
    `[data-role="warning"][data-field = "${field}"]`,
  );

  _clearValidationMessageUI(messageField);

  if (issue.severity === "warning") {
    const confirmBtn = document.querySelector(
      `[data-role="warning-consent-checkbox"][data-field="${field}"]`,
    );
    confirmBtn.classList.remove("hidden");
  }
  const classes = ERROR_MESSAGE_SEVERITY_CLASSES[issue.severity];
  if (!classes) return;
  messageField.innerHTML = issue.message;
  messageField.classList.remove("hidden");
  messageField.classList.add(...classes);
}

function _clearValidationMessageUI(messageField) {
  if (!messageField) return;
  messageField.classList.add("hidden");
  messageField.classList.remove(...ALL_ERROR_MESSAGE_SEVERITY_CLASSES);
}

export function resetValidationMessage(field) {
  const confirmBtn = document.querySelector(
    `[data-role="warning-consent-checkbox"][data-field="${field}"]`,
  );
  confirmBtn.classList.add("hidden");

  const messageField = document.querySelector(
    `[data-role="warning"][data-field = "${field}"]`,
  );
  messageField.classList.add("hidden");
  messageField.classList.remove(...ALL_ERROR_MESSAGE_SEVERITY_CLASSES);
}

export function hideWarningMessage(field) {
  const confirmBtn = document.querySelector(
    `[data-role="warning-consent-checkbox"][data-field="${field}"]`,
  );
  confirmBtn.classList.add("hidden");
  const messageField = document.querySelector(
    `[data-role="warning"][data-field = "${field}"]`,
  );
  messageField.classList.add("hidden");
  messageField.classList.remove(...ALL_ERROR_MESSAGE_SEVERITY_CLASSES);
}
