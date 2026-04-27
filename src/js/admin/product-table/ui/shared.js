/**
 * @module UI/Shared
 * @description General UI utility functions for managing common element states
 * (modals, overlays, transitions) across the application.
 */

/**
 * Enum for modal visibility states.
 * @readonly
 * @enum {string}
 */
const MODAL_STATES = {
  VISIBLE: "visible",
  HIDDEN: "hidden",
};

/**
 * Tailwind CSS class mapping for modal visibility transitions.
 * @type {Object.<string, string[]>}
 */
const MODAL_STATE_CLASSES = {
  visible: ["opacity-100", "pointer-events-auto"],
  hidden: ["opacity-0", "pointer-events-none"],
};

/**
 * A flattened array of all modal state classes used for resetting elements.
 * @type {string[]}
 */
const ALL_MODAL_STATE_CLASSES = Object.values(MODAL_STATE_CLASSES).flat();

/**
 * Updates the visual state of a modal element by toggling CSS classes.
 * * @param {HTMLElement} el - The modal container element.
 * @param {('visible'|'hidden')} state - The target state to apply.
 */
function setModalState(el, state) {
  if (!MODAL_STATE_CLASSES[state]) return;

  el.classList.remove(...ALL_MODAL_STATE_CLASSES);
  el.classList.add(...MODAL_STATE_CLASSES[state]);
}

/**
 * Transitions the modal to a hidden state (invisible and non-interactive).
 * * @param {HTMLElement} el - The modal element to hide.
 */
function hideModalState(el) {
  setModalState(el, MODAL_STATES.HIDDEN);
}


/**
 * Transitions the modal to a visible state (fully opaque and interactive).
 * * @param {HTMLElement} el - The modal element to show.
 */
function showModalState(el) {
  setModalState(el, MODAL_STATES.VISIBLE);
}

export const modalUI = {
  hideModalState,
  showModalState,
};


