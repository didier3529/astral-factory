import { createContext } from 'react';

export const SelectionContext = createContext({
  selection: [],
  dispatchSelection: () => {},
}); 