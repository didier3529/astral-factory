import { createContext } from 'react';

export const HistoryContext = createContext({
  history: [],
  currentIndex: -1,
  dispatchHistory: () => {}
});

export const initialHistoryState = {
  history: [],
  currentIndex: -1
};

export const historyReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_HISTORY': {
      const newHistory = [...state.history.slice(0, state.currentIndex + 1), action.payload];
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1
      };
    }
    case 'UNDO': {
      if (state.currentIndex > 0) {
        return {
          ...state,
          currentIndex: state.currentIndex - 1
        };
      }
      return state;
    }
    case 'REDO': {
      if (state.currentIndex < state.history.length - 1) {
        return {
          ...state,
          currentIndex: state.currentIndex + 1
        };
      }
      return state;
    }
    case 'RESET': {
      return initialHistoryState;
    }
    default:
      return state;
  }
}; 