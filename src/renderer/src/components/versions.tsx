// import React from "react"

export function Versions() {
    const versions = {
        electron: "0.0",
        chrome: "0.0",
        node: "0.0"
    }

    return (
        <ul>
            <li>Electron v{versions.electron}</li>
            <li>Chrome v{versions.chrome}</li>
            <li>Node v{versions.node}</li>
        </ul>
    )
}