

const ERROR_MESSAGE_SEVERITY_CLASSES ={
    warning: ["bg-yellow-500", "text-white"],
    error: ["bg-red-500", "text-white"]
}

const ALL_ERROR_MESSAGE_SEVERITY_CLASSES = Object.values(ERROR_MESSAGE_SEVERITY_CLASSES).flat();
export function renderValidationMessage(field, issue) {
  const messageField = document.querySelector(`[data-role="warning"][data-field = "${field}"]`);

  _clearValidationMessageUI(messageField);

  const classes = ERROR_MESSAGE_SEVERITY_CLASSES[issue.severity];
  if (!classes) return;
  messageField.textContent = issue.message;
  messageField.classList.remove("hidden");
  messageField.classList.add(...classes);
}



function _clearValidationMessageUI(messageField){
    if(!messageField) return;
    messageField.classList.add("hidden");
    messageField.classList.remove(...ALL_ERROR_MESSAGE_SEVERITY_CLASSES);
}


export function resetValidationMessage(field){
    const messageField = document.querySelector(`[data-role="warning"][data-field = "${field}"]`);
    messageField.classList.add("hidden");
    messageField.classList.remove(...ALL_ERROR_MESSAGE_SEVERITY_CLASSES);
}
