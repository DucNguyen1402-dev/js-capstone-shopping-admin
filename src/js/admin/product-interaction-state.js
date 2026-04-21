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
  _list: [],
  _onFilter: false,
  /** * Updates the current list of active filters.
   * @param {Array<any>} list
   */
  setFilterList(list) {
    this._list = list;
  },
  /** * Get filter state when filter event is active
   * @param {Boolean} onFilter
   */
  onFilterState(onFilter) {
    this._onFilter = onFilter;
  },
  /** * Retrieves the current list of active filters.
   * @returns {Array<any>}
   */
  getFilterList(){
    return [...this._list];
  },
  /**
   * Returns filtered list if active, otherwise default list.
   */
  resolveFilterList(defaultList) {
    if (!this._onFilter) return defaultList;
    return this._list;
  },
};
