import React from "react";
import GroceryList from "../groceries/groceryList";

export const stores = ["Rema 1000", "Lidl", "Netto", "Kvickly", "Other"];

export type Grocery = {
    id: string;
    householdId: string;
    title: string;
    quantity: number;
    storePref: string;
};

export default function GroceriesPage() {
    return (
        <GroceryList/>
    );
}
