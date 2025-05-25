"use client";
import React, { createContext, useContext, useState } from "react";

type DirtyContextType = {
  isDirty: boolean;
  setIsDirty: (val: boolean) => void;
};

const DirtyContext = createContext<DirtyContextType>({
  isDirty: false,
  setIsDirty: () => {},
});

export const useDirty = () => useContext(DirtyContext);

export const DirtyProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDirty, setIsDirty] = useState(false);
  return (
    <DirtyContext.Provider value={{ isDirty, setIsDirty }}>
      {children}
    </DirtyContext.Provider>
  );
};