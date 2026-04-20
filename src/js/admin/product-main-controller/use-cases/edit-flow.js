import { updateProduct } from "../../index.js";

/**
 * Initializes the edit context by capturing the target ID.
 * @param {Object} pendingActionState - Local state buffer.
 * @param {Object} action - Action containing target ID.
 */
export function startEdit(pendingActionState, action) {
  pendingActionState.editId = action.payload.id;
}

/**
 * Persists updated payload using the captured edit context.
 * @param {Object} pendingActionState - Local state buffer.
 * @param {Object} data - Validated product data.
 */
export async function submitProductUpdate(pendingActionState, data) {
  await updateProduct(pendingActionState.editId, data);
  pendingActionState.editId = null
}
