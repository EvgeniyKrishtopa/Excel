import {
  TABLE_RESIZE,
  CHANGE_TEXT,
  CHANGE_TABLE_TITLE,
  CHANGE_STYLES,
  APPLY_STYLE,
} from "./types";

export function rootReducer(state, action) {
  let prevState;
  let field;
  let val;

  switch (action.type) {
    case TABLE_RESIZE:
      field = action.data.resizeType === "col" ? "colState" : "rowState";
      prevState = state[field] || {};

      if (action.data.resizeType === "col") {
        prevState[action.data.idCol] = action.data.width;
      }

      if (action.data.resizeType === "row") {
        prevState[action.data.idRow] = action.data.height;
      }
      return { ...state, [field]: prevState };

    case CHANGE_TEXT:
      prevState = state["dataState"] || {};
      prevState[action.data.id] = action.data.text;
      return { ...state, currentText: action.data.text, dataState: prevState };

    case CHANGE_TABLE_TITLE:
      return { ...state, tableTitle: action.data };

    case CHANGE_STYLES:
      return { ...state, currentStyles: action.data };

    case APPLY_STYLE:
      field = "stylesState";
      val = state[field] || {};
      action.data.ids.forEach((id) => {
        val[id] = { ...val[id], ...action.data.value };
      });

      return {
        ...state,
        [field]: val,
        currentStyles: {
          ...state.currentStyles,
          ...action.data.value,
        },
      };
    default:
      return state;
  }
}
