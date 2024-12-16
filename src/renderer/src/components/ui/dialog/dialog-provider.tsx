import { DialogContext, DialogContextValue } from "./dialog-context"

export type DialogContextProviderProps = React.PropsWithChildren<{ 
    value: DialogContextValue
}>

export const DialogContextProvider = (props: DialogContextProviderProps) => {
    return (
        <DialogContext.Provider 
            value={props.value}
            children={props.children}
        />
    )
}