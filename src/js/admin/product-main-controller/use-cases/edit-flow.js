import { updateProduct } from "../../index.js";

/**
 * Persists updated payload using the captured edit context.
 * @param {Object} pendingActionState - Local state buffer.
 * @param {Object} data - Validated product data.
 */
export async function submitProductUpdate(id, data) {
  await updateProduct( id, data);

}
