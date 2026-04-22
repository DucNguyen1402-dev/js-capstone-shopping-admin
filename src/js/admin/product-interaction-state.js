/**
 * State management for task execution workflows (Delete, Edit, Filter).
 * Stores identifiers or data lists between actions to determine subsequent logic.
 */

/**
 * Manages the state of records pending deletion.
 */
export const deletionState = {
  /** @type {string|number|null} */
  _id: null,

  /** * Sets the ID of the record to be deleted.
   * @param {string|number} id
   */
  setDeletedId(id) {
    this._id = id;
  },

  /** * Retrieves the current ID pending deletion.
   * @returns {string|number|null}
   */
  getDeletedId() {
    return this._id;
  },
};

/**
 * Manages the state of the record currently being edited.
 */
export const editingState = {
  /** @type {string|number|null} */
  _id: null,

  /** * Sets the ID of the record to enter edit mode.
   * @param {string|number} id
   */
  setEditId(id) {
    this._id = id;
  },

  /** * Retrieves the ID of the record currently under edit.
   * @returns {string|number|null}
   */
  getEditId() {
    return this._id;
  },
};

/**
 * Manages active filter criteria.
 */
export const filterState = {
  /** @type {Array<any>} */
  _type: "all",

  setFilterType(type) {
    this._type = type;
  },

  getFilterType() {
    return this._type;
  },
};

export const filteredList = {
  length: null,
};

export const sortedPriceState = {
  sortStrategy: "price_desc",
};

export const searchState = {
  onSearch: false,
  list: []
}