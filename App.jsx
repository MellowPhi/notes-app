import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { addDoc, onSnapshot, doc, deleteDoc, setDoc } from "firebase/firestore"
import { notesCollection, db } from './firebase'

export default function App() {
    // Setting up the state
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText, setTempNoteText] = React.useState("")
    
    const sortedNotes = notes.slice();
    sortedNotes.sort((a, b) => b.updatedAt - a.updatedAt);

    console.log(currentNoteId)
    
    const currentNote = 
        notes.find(note => note.id === currentNoteId)  
        || notes[0]



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

    // If notes array changes, check if there is no currentId
    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    React.useEffect(() => {
        if (currentNote) {
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])
    

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            updateNote(tempNoteText)
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])


    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        // Pushing the notes to firestore
        // addDoc returns promise
        const newNoteRef = await addDoc(notesCollection, newNote)
        // setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNoteRef.id)
    }

    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, 
            { body: text, updatedAt: Date.now() },
            { merge: true}
            )
    }

    async function deleteNote(noteId) {
        // Get a ref for the doc to be deleted
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
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                        <Editor
                            tempNoteText={tempNoteText}
                            setTempNoteText={setTempNoteText}
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
