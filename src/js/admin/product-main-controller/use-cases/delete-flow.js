import {
  deleteData
} from "../../index.js";

/**
 * Stages a product ID for pending deletion context.
 * @param {Object} pendingActionState - Local state buffer.
 * @param {Object} action - Action containing target ID.
 */
export function prepareDelete(pendingActionState, action){
    pendingActionState.deletedId = action.payload.id;
}

/**
 * Executes remote deletion and resets the pending context.
 * @param {Object} pendingActionState - Local state buffer.
 */
export async function confirmDeleteAndUpdate(pendingActionState) {
  await deleteData(pendingActionState.deletedId);
  pendingActionState.deletedId = null;
}
