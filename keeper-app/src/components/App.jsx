import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Note from './Note';
import CreateArea from './CreateArea';

function App() {
    const [notes, setNotes] = useState([]);
    function addNote(note) {
        setNotes([...notes, note]);
    }

    function deleteNote(id) {
        setNotes(curr => {
            return curr.filter((note, idx) => (
                idx !== id
            ))
        })
    }

    return (
        <div> 
            <Header />
            <CreateArea addNote={addNote}/>
            {notes.map((note, idx) => (
                <Note 
                    id={idx}
                    title={note.title}
                    content={note.content}
                    deleteNote={deleteNote}
                />
            ))}
            <Footer />
        </div>       
    )
}

export default App;