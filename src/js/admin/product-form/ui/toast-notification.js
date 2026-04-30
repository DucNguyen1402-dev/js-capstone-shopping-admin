
/**
 * Toggles the visibility of a loading element.
 * @param {HTMLElement} loading - The loading DOM element.
 * @param {boolean} [visible=true] - Whether to show or hide the element.
 */
export function setToastLoadingToVisible(loading, visible = true){
  loading.classList.toggle("hidden", !visible);
}


/**
 * State mapping for popup visibility using CSS classes.
 * @type {Object.<string, string[]>}
 */
const POPUP_STATE = {
  visible: ["opacity-100", "pointer-events-auto"],
  hidden: ["opacity-0", "pointer-events-none"]
};

/**
 * A flat array of all possible popup state classes for cleanup.
 * @type {string[]}
 */
const ALL_POPUP_STATE = Object.values(POPUP_STATE).flat();

/**
 * Updates a popup element's visibility state by swapping CSS classes.
 * @param {HTMLElement} update - The popup DOM element to update.
 * @param {boolean} [visible=true] - Target visibility state.
 */
export function setUpdatePopUpToVisible(update, visible = true){
  update.classList.remove(...ALL_POPUP_STATE);
  const state = visible ? "visible" : "hidden";
  update.classList.add(...POPUP_STATE[state]);
}

