
export const productUIState = {
  deleteId: null,
  editId: null,
  onEditForm: false,
};

export const productFilterState = {
  filterType: "all",
  filteredCount: 0,
};

export const productSortedState = {
  sortPriceStrategy: "price_desc",
};



export const productSearchState = {
  isSearching: false,
  searchResultIds: [],

};

export const productFormState = {
  mode: "",
  onDraft: false,
  reset() {
    this.mode = "";
    this.onDraft = false;
  },
};

