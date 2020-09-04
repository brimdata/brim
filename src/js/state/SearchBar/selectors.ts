

import { createSelector } from "reselect";

import { SearchBarState, SearchTarget } from "./types";
import { State } from "../types";
import { TabState } from "../Tab/types";
import Tabs from "../Tabs";
import brim from "../../brim";

export const getSearchBar = createSelector<State, void, SearchBarState, TabState>(Tabs.getActiveTab, tab => tab.searchBar);

export const getSearchBarInputValue = createSelector<State, void, string, SearchBarState>(getSearchBar, searchBar => searchBar.current);

export const getSearchBarPins = createSelector<State, void, string[], SearchBarState>(getSearchBar, searchBar => searchBar.pinned);

export const getSearchBarPreviousInputValue = createSelector<State, void, string, SearchBarState>(getSearchBar, searchBar => searchBar.previous);

export const getSearchBarEditingIndex = createSelector<State, void, number | null, SearchBarState>(getSearchBar, searchBar => searchBar.editing);

export const getSearchBarError = createSelector<State, void, string | null, SearchBarState>(getSearchBar, searchBar => searchBar.error);

export const getSearchProgram = createSelector<State, void, any, any, any>(getSearchBarPins, getSearchBarPreviousInputValue, (pinned, prev) => brim.program(prev, pinned).string() || "*");

export const getTarget = createSelector<State, void, SearchTarget, SearchBarState>(getSearchBar, state => state.target);