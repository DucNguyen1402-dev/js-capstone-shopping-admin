
export function setToastLoadingToVisible(loading, visible = true){
  loading.classList.toggle("hidden", !visible);
}



const POPUP_STATE = {
  visible: ["opacity-100", "pointer-events-auto"],
  hidden: ["opacity-0", "pointer-events-none"]
};

const ALL_POPUP_STATE = Object.values(POPUP_STATE).flat();

export function setUpdatePopUpToVisible(update, visible = true){
  update.classList.remove(...ALL_POPUP_STATE);
  const state = visible ? "visible" : "hidden";
  update.classList.add(...POPUP_STATE[state]);
}

