const MODAL_STATES = Object.freeze({
  VISIBLE: "visible",
  HIDDEN: "hidden",
});

const MODAL_STATE_CLASSES = {
  visible: ["opacity-100", "pointer-events-auto"],
  hidden: ["opacity-0", "pointer-events-none"],
};

const ALL_MODAL_STATE_CLASSES = Object.values(MODAL_STATE_CLASSES).flat();

function setModalState(el, state) {
  if (!MODAL_STATE_CLASSES[state]) return;

  el.classList.remove(...ALL_MODAL_STATE_CLASSES);
  el.classList.add(...MODAL_STATE_CLASSES[state]);
}

export function hideModelState(el) {
  setModalState(el, MODAL_STATES.HIDDEN);
}

export function showModelState(el) {
  setModalState(el, MODAL_STATES.VISIBLE);
}





export function getProductId(actionEl) {
  const productRowEl = actionEl.closest(".product-item");
  return productRowEl.dataset.productId;
}