/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Router } from "@reach/router"
import Editor from "./Editor"

const App: React.FC = () => {
    return (
        <div css={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <input
                disabled
                css={{
                    fontSize: "0.8em",
                    color: "#949494",
                    padding: "16px 16px 0",
                    fontFamily: "'Roboto Mono', monospace",
                    border: "none",
                    boxShadow: "none",
                    margin: 0
                }}
                value={window.location.toString()}
            />
            <Router css={{ flexGrow: 1, position: "relative" }}>
                <Editor path="/" />
                <Editor path="/:id" />
            </Router>
        </div>
    )
}

export default App
