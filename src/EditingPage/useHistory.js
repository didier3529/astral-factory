import { useContext, useCallback, useMemo } from 'react';
import { HistoryContext } from './HistoryContext';

export const useHistory = () => {
  const { history, currentIndex, dispatchHistory } = useContext(HistoryContext);

  const currentState = useMemo(() => {
    return history[currentIndex] || null;
  }, [history, currentIndex]);

  const canUndo = useMemo(() => currentIndex > 0, [currentIndex]);
  const canRedo = useMemo(() => currentIndex < history.length - 1, [currentIndex, history.length]);

  const addToHistory = useCallback((state) => {
    dispatchHistory({ type: 'ADD_TO_HISTORY', payload: state });
  }, [dispatchHistory]);

  const undo = useCallback(() => {
    dispatchHistory({ type: 'UNDO' });
  }, [dispatchHistory]);

  const redo = useCallback(() => {
    dispatchHistory({ type: 'REDO' });
  }, [dispatchHistory]);

  const reset = useCallback(() => {
    dispatchHistory({ type: 'RESET' });
  }, [dispatchHistory]);

  return {
    history,
    currentIndex,
    currentState,
    canUndo,
    canRedo,
    addToHistory,
    undo,
    redo,
    reset
  };
}; 