import { createContext } from 'react';

export const EditingContext = createContext({
  objects: [],
  dispatchObjects: () => {},
}); 