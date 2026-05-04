export function triggerStatusEvent(value, { productFormInputEl }) {
  const { status } = productFormInputEl;
  status.value = value;
  status.dispatchEvent(new Event("change"));
}

