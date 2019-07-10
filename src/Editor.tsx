/** @jsx jsx */
import { jsx } from "@emotion/core"
import React, { useState, SyntheticEvent, useEffect, useRef } from "react"
import firebase from "./firebase"
import { navigate } from "@reach/router"

const db = firebase.firestore()

const Editor: React.FC<{ path?: string; id?: string }> = ({ id }) => {
    const [loading, setLoading] = useState(true)
    const [docRef, setDocRef] = useState()
    const [value, setValue] = useState("")
    const [selectionStart, setSelectionStart] = useState()
    const [selectionEnd, setSelectionEnd] = useState()
    const textArea = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        async function createDocument() {
            const r = await db.collection("files").add({
                value:
                    "Welcome to your new document! Share this link with anyone to start no-frills collaborative editing."
            })
            navigate(`/${r.id}`)
        }

        function loadDocument() {
            const r = db.collection("files").doc(id)
            setDocRef(r)

            r.onSnapshot(applyChanges)
        }

        if (id) {
            loadDocument()
        } else {
            createDocument()
        }
    }, [id])

    useEffect(() => {
        async function getInitialState() {
            const doc = await docRef.get()
            applyChanges(doc)
            setLoading(false)
        }

        if (docRef) {
            getInitialState()
        }
    }, [docRef])

    async function applyChanges(doc: firebase.firestore.DocumentSnapshot) {
        const value = doc.get("value")
        setValue(value)
    }

    function writeChanges(v: string) {
        docRef.update({
            value: v
        })
    }

    function checkSelectionRange(e: SyntheticEvent<HTMLTextAreaElement>) {
        setSelectionStart(e.currentTarget.selectionStart)
        setSelectionEnd(e.currentTarget.selectionEnd)
    }

    function onChange(e: SyntheticEvent<HTMLTextAreaElement>) {
        const v = e.currentTarget.value
        setValue(v)
        writeChanges(v)
        console.log("uhhhh")
        checkSelectionRange(e)
    }

    function onClick(e: SyntheticEvent<HTMLTextAreaElement>) {
        checkSelectionRange(e)
    }

    if (loading) {
        return (
            <div
                css={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "'Roboto Mono', monospace"
                }}
            >
                loading...
            </div>
        )
    }

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.keyCode === 9 && textArea && textArea.current) {
            e.preventDefault()

            const newValue =
                value.substr(0, selectionStart) +
                "    " +
                value.substr(selectionEnd)
            setValue(newValue)

            const pos = selectionStart + 4

            textArea.current.selectionStart = pos
            textArea.current.selectionEnd = pos

            setSelectionStart(pos)
            setSelectionEnd(pos)
        }
    }

    return (
        <textarea
            ref={textArea}
            spellCheck={false}
            css={{
                boxSizing: "border-box",
                flex: 1,
                resize: "none",
                padding: 16,
                fontSize: "1em",
                border: "none",
                fontFamily: "'Roboto Mono', monospace",
                "&:focus": {
                    outline: "none"
                },
                boxShadow: "none",
                outline: "none",
                overflow: "auto"
            }}
            autoFocus
            value={value}
            onChange={onChange}
            onClick={onClick}
            onKeyDown={onKeyDown}
        />
    )
}

export default Editor
