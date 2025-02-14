import { createPortal } from "react-dom"

export type PortalRootElement = HTMLElement | DocumentFragment

export type PortalProps = React.PropsWithChildren<{
    root: PortalRootElement
}>

export const Portal = ({ root, children }: PortalProps) => {
    return createPortal(children, root)
}