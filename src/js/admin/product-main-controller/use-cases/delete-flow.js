import {
  deleteData
} from "../../index.js";

/**
 * Stages a product ID for pending deletion context.
 * @param {Object} deletionState - Local state buffer.
 * @param {Object} action - Action containing target ID.
 */
export function setDeleteTarget(deletionState, deletedId){
    deletionState.setDeletedId(deletedId);
}

/**
 * Executes remote deletion and resets the pending context.
 * @param {Object} deletionState - Local state buffer.
 */
export async function performDeleteAndUpdate(deletionState) {
  await deleteData(deletionState.getDeletedId());
}
