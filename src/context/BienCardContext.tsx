import React, { createContext, useContext } from "react";
import { Bien } from "../types/models";

export type BienCardContextType = {
  bien: Bien;
  onEdit: (bien: Bien) => void;
};

const BienCardContext = createContext<BienCardContextType | undefined>(
  undefined
);

export const useBienCardContext = () => {
  const context = useContext(BienCardContext);
  if (!context)
    throw new Error(
      "useBienCardContext must be used within a BienCardContext.Provider"
    );
  return context;
};

export default BienCardContext;
