export type DialogProps = React.PropsWithChildren<{}>

export const Dialog = ({ children }: DialogProps) => {
    return (
        <div role="dialog">
            {children}
        </div>
    )
}