import {
  setToastLoadingToVisible,
  setPopUpToVisible,
  setPopUpForError
} from "../ui/toast-notification.js";

import { toastNotificationEl } from "../dom.js";

/**
 * Activates the global loading indicator.
 */
function showToastLoading() {
  const { loading } = toastNotificationEl;
  setToastLoadingToVisible(loading, true);
}

/**
 * Dismisses the global loading indicator.
 */
function hideToastLoading() {
  const { loading } = toastNotificationEl;
  setToastLoadingToVisible(loading, false);
}

/**
 * Triggers a self-dismissing update success notification.
 * @description Displays the toast and auto-hides after a 2500ms delay.
 */
function showTemporaryUpdateToast() {
  const { update } = toastNotificationEl;
  setPopUpToVisible(update, true);

  setTimeout(() => {
    setPopUpToVisible(update, false);
  }, 2500);
}

function showTemporaryAddToast() {
  const { add } = toastNotificationEl;
  setPopUpToVisible(add, true);

  setTimeout(() => {
    setPopUpToVisible(add, false);
  }, 2500);
}

function showTemporaryErrorToast(message) {
  const { error } = toastNotificationEl;
  setPopUpForError(error, message);
  setPopUpToVisible(error, true);
  setTimeout(() => {
    setPopUpToVisible(error, false);
  }, 3500);
}


/**
 * Unified notification service interface using ES6 Shorthand properties.
 * @description
 * Aggregates feedback operations into a single namespace.
 * Provides a streamlined API for global UI notifications.
 */
export const toastServices = {
  showUpdateSuccess: showTemporaryUpdateToast,
  showAddSuccess: showTemporaryAddToast,
  showError: showTemporaryErrorToast,
  showLoading: showToastLoading,
  hideLoading: hideToastLoading,
};
