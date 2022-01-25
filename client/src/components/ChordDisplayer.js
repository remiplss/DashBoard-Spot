import { useState, useEffect, useMemo } from 'react';
import { Container } from 'react-bootstrap';
import { chordParserFactory, chordRendererFactory } from 'chord-symbol';

import 'custom-piano-keys';

export default function ChordDisplayer() {
    const [value, setValue] = useState("");
    const [notes, setNotes] = useState("");

    function onChange(event) {
        setValue(event.target.value);
        console.log(value);
    };

    //changement de la valeur
    function handleSubmit(event) {
        event.preventDefault();

        var notes = convertisseur(event)

        piano(event, notes)
    }

    //Fonction qui convertit un accord en notes
    function convertisseur(event) {
        event.preventDefault();

        const parseChord = chordParserFactory();
        const renderChord = chordRendererFactory({

        });

        console.log(value);
        var chord = parseChord(value).normalized.notes;

        let notesArray = new Array();
        var notesString;
        for (let i = 0; i < chord.length; i++) {

            if (chord[i] === 'C') {
                notesArray.push(1);
            }
            if (chord[i] === 'C#') {
                notesArray.push(2);
            }
            if (chord[i] === 'D') {
                notesArray.push(3);
            }
            if (chord[i] === 'D#') {
                notesArray.push(4);
            }
            if (chord[i] === 'E') {
                notesArray.push(5);
            }
            if (chord[i] === 'F') {
                notesArray.push(6);
            }
            if (chord[i] === 'F#') {
                notesArray.push(7);
            }
            if (chord[i] === 'G') {
                notesArray.push(8);
            }
            if (chord[i] === 'G#') {
                notesArray.push(9);
            }
            if (chord[i] === 'A') {
                notesArray.push(10);
            }
            if (chord[i] === 'A#') {
                notesArray.push(11);
            }
            if (chord[i] === 'B') {

                notesArray.push(12);
            }


        }
        notesString = notesArray.join(' ');
        console.log(notesArray);
        return notesString;
    }
    //Affiche les notes de l'accord sur le piano
    function piano(event, notes) {

        console.log(notes);

        setNotes(notes);
    }

    return (
        <div className="k-mb-4">
            <form onSubmit={handleSubmit}>
                <label>Chord:
                    <input value={value} onChange={onChange} type="text" id="chord-input" />
                </label>
                <input className="btn btn-success btn-lg" type="submit" value="Envoyer" />
            </form>
            <Container className='d-flex align-items-center'>
                <custom-piano-keys marked-keys={notes} oct-count='2'> </custom-piano-keys>
            </Container>
        </div>
    )
}

