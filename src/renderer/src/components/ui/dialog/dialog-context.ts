import React from "react"

export type DialogContextValue = {
    open: (component: () => React.ReactNode) => void,
    close: (component: () => React.ReactNode) => void
}

export const DialogContext = React.createContext<DialogContextValue | undefined>(undefined)
