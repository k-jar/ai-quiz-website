import axios from 'axios';

export async function getWordsFromDeck(deckName) {
    try {
        const response = await axios.post('http://localhost:8765', {
            action: 'findNotes',
            version: 6,
            params: {
                query: `deck:"${deckName}"`
            }
        });

        const noteIds = response.data.result;
        console.log(noteIds);

        // There needs to be a delay between the two requests
        await new Promise(resolve => setTimeout(resolve, 1));

        const noteInfo = await axios.post('http://localhost:8765', {
            action: 'notesInfo',
            version: 6,
            params: {
                notes: noteIds
            }
        });

        console.log(noteInfo.data.result);

        return noteInfo.data.result.map(note => note.fields.Word.value);
    } catch (error) {
        console.error('Error fetching data from Anki:', error);
        throw new Error('Failed to fetch data from Anki');
    }
}
