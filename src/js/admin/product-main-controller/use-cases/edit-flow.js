import { updateProduct } from "../../index.js";

/**
 * Initializes the edit context by capturing the target ID.
 * @param {Object} pendingActionState - Local state buffer.
 * @param {Object} action - Action containing target ID.
 */
export function startEdit(editingState, editId) {
  editingState.setEditId(editId);
}

/**
 * Persists updated payload using the captured edit context.
 * @param {Object} pendingActionState - Local state buffer.
 * @param {Object} data - Validated product data.
 */
export async function submitProductUpdate(editingState, data) {
  await updateProduct( editingState.getEditId(), data);
 editingState.setEditId(null);
}
