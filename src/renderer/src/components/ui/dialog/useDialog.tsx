import React from "react"
import { DialogContext } from "./dialog-context"
import { AlertDialog } from "./alert-dialog"
import { ConfirmDialog } from "./confirm-dialog"
import { PromptDialog } from "./prompt-dialog"
import { DialogContextValue } from "./dialog-context"

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

export const useDialog = () => {
    const context = React.useContext(DialogContext)
    if(!context) {
        throw new Error(`${useDialog.name} should be within ${DialogContextProvider.name} component.`)
    }

    const alert = () => context.open(AlertDialog)
    const confirm = () => context.open(ConfirmDialog)
    const prompt = () => context.open(PromptDialog)

    return { open, close, alert, confirm, prompt }
}