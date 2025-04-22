import { useReducer } from 'react';
import { HistoryContext, historyReducer, initialHistoryState } from './HistoryContext';

export const HistoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(historyReducer, initialHistoryState);

  return (
    <HistoryContext.Provider
      value={{
        history: state.history,
        currentIndex: state.currentIndex,
        dispatchHistory: dispatch
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}; 