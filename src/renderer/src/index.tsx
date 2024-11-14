import React from "react"
import { createRoot, Root } from "react-dom/client"
import { App } from "./app"
import "./index.css"

class CustomAppRootElement extends HTMLElement {

    private root!: Root
   
    public constructor() {
        super()
        this.root = createRoot(this) 
    }

    public connectedCallback() {
        this.root?.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        )
    }

    public disconnectedCallback() {
        this.root?.unmount()
    }

}

customElements.define("app-root", CustomAppRootElement)