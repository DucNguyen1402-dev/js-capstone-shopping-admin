import {
  deleteData
} from "../../index.js";

/**
 * Executes remote deletion and resets the pending context.
 * @param {Object} deletionState - Local state buffer.
 */
export async function performDelete(id) {
  await deleteData(id);
}
