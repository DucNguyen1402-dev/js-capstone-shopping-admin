import {
  deleteData
} from "../../index.js";

/**
 * Stages a product ID for pending deletion context.
 * @param {Object} deletionState - Local state buffer.
 * @param {Object} action - Action containing target ID.
 */
export function prepareDelete(deletionState, action){
    deletionState.setDeletedId(action.payload.id);
}

/**
 * Executes remote deletion and resets the pending context.
 * @param {Object} deletionState - Local state buffer.
 */
export async function confirmDeleteAndUpdate(deletionState) {
  await deleteData(deletionState.getDeletedId());
  deletionState.setDeletedId(null);
}
