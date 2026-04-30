import {
  setToastLoadingToVisible,
  setUpdatePopUpToVisible,
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
  setUpdatePopUpToVisible(update, true);

  setTimeout(() => {
    setUpdatePopUpToVisible(update, false);
  }, 2500);
}


/**
 * Unified notification service interface using ES6 Shorthand properties.
 * @description
 * Aggregates feedback operations into a single namespace.
 * Provides a streamlined API for global UI notifications.
 */
export const toastServices = {
  showUpdateSuccess: showTemporaryUpdateToast,
  showLoading: showToastLoading,
  hideLoading: hideToastLoading,
};
