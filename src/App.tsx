/** @jsx jsx */
import { jsx } from "@emotion/core"
import { useEffect, useState } from "react"
import { Router, globalHistory } from "@reach/router"
import Editor from "./Editor"

const App: React.FC = () => {
    const [url, setUrl] = useState(window.location.toString())

    useEffect(() => {
        const removeListener = globalHistory.listen(params => {
            const { location } = params
            setUrl(location.href)
        })
        return () => {
            removeListener()
        }
    }, [])

    return (
        <div
            css={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                alignItems: "stretch"
            }}
        >
            <input
                css={{
                    fontSize: "0.8em",
                    padding: "16px 16px 0",
                    fontFamily: "'Roboto Mono', monospace",
                    border: "none",
                    boxShadow: "none",
                    margin: 0,
                    textShadow: "0 0 0 #949494",
                    color: "transparent",
                    "&:focus": {
                        outline: "none"
                    }
                }}
                onChange={() => false}
                onFocus={e => e.target.select()}
                value={url}
            />
            <Router
                css={{
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "stretch",
                    flexDirection: "column"
                }}
            >
                <Editor path="/" />
                <Editor path="/:id" />
            </Router>
        </div>
    )
}

export default App
