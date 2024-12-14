import React, { createContext, useContext } from "react"

export type ModalContext = {

}

export const ModalContext = createContext<ModalContext | undefined>(undefined)

export type ModalContextProviderProps = React.PropsWithChildren<{ 
    value: ModalContext 
}>

export const ModalContextProvider = (props: ModalContextProviderProps) => {
    return (
        <ModalContext.Provider 
            value={props.value}
            children={props.children}
        />
    )
}

export const useModalContext = () => {
    const context = useContext(ModalContext)
    if(!context) {
        throw new Error(`${useModalContext.name} should be within ${ModalContextProvider.name} component.`)
    }
    return context
}