/**
 * Hide loading element by adding `hidden` class.
 * @param {HTMLElement|null} loadingEl
 */
function hideLoadingSpinner(loadingEl, isLoading) {
  if (!loadingEl) return;

  loadingEl.classList.toggle("hidden", !isLoading);
}

/**
 * Loading spinner UI helpers.
 */
export const loadingSpinnerUI = {
  hideLoadingSpinner,
};
