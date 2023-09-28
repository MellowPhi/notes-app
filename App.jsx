import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { addDoc, onSnapshot, doc, deleteDoc, setDoc } from "firebase/firestore"
import { notesCollection, db } from './firebase'

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    
    // const [currentNoteId, setCurrentNoteId] = React.useState(
    //     (notes[0]?.id) || ""
    // )

    console.log(currentNoteId)
    
    const currentNote = 
        notes.find(note => note.id === currentNoteId)  
        || notes[0]

    
    // React.useEffect(() => {
    //     localStorage.setItem("notes", JSON.stringify(notes))
    // }, [notes])
    // Reading from firebase datebase

    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
        // Sync up our local notes array with the snapshot data
        console.log("this are changing!")
        const notesArr = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }))
        setNotes(notesArr)
        })
        return unsubscribe
    }, [])

    //
    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here"
        }
        // Pushing the notes to firestore
        const newNoteRef = await addDoc(notesCollection, newNote)
        // setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNoteRef.id)
    }

    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, { body: text }, { merge: true})


        // setNotes(oldNotes => {
        //     const newArray = []
        //     for (let i = 0; i < oldNotes.length; i++) {
        //         const oldNote = oldNotes[i]
        //         if (oldNote.id === currentNoteId) {
        //             // Put the most recently-modified note at the top
        //             newArray.unshift({ ...oldNote, body: text })
        //         } else {
        //             newArray.push(oldNote)
        //         }
        //     }
        //     return newArray
        // })
    }

    async function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={notes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                            // currentNoteId &&
                            // notes.length > 0 &&
                            <Editor
                                currentNote={currentNote}
                                updateNote={updateNote}
                            />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
