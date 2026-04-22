import { createContext } from "react";

export const IntroContext = createContext<{ } | undefined>(undefined);

const IntroProvider = ({ children }: { children: React.ReactNode }) => {

    return (
        <IntroContext.Provider value={undefined}>
            {children}
        </IntroContext.Provider>
    )
}

export default IntroProvider;