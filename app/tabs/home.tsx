import { Timestamp } from "firebase/firestore";
import React from "react";
import HomeView from "../home/homeView";

export type Meal = {
    id: string;
    recipeId: string;
    date: Timestamp
}

export default function HomePage() {
    return <HomeView />

}


