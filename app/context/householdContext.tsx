import React, { createContext, useContext, useState } from "react";

type HouseholdContextType = {
  householdId: string;
  setHouseholdId: (id: string) => void;
};

const HouseholdContext = createContext<HouseholdContextType | undefined>(
  undefined
);

export function HouseholdProvider({ children }: { children: React.ReactNode }) {
  const [householdId, setHouseholdId] = useState<string>("");

  return (
    <HouseholdContext.Provider value={{ householdId, setHouseholdId }}>
      {children}
    </HouseholdContext.Provider>
  );
}

export default function useHousehold() {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error("useHousehold must be used inside HouseholdProvider");
  }
  return context;
}
