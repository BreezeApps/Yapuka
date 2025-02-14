import { Dialog } from "./dialog"
import { DialogTitle } from "./dialog-title"
import { DialogContent } from "./dialog-content"
import { DialogActions } from "./dialog-actions"

export type AlertDialogProps = React.PropsWithChildren<{
    onClose: () => void
}>

export const AlertDialog = () => {
    return (
        <Dialog>
            <DialogTitle>
                Alert
            </DialogTitle>
            <DialogContent>
                Hello World
            </DialogContent>
            <DialogActions>
                OK
            </DialogActions>
        </Dialog>
    )
}