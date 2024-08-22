import { Router } from 'express';
import { getWordsFromDeck } from '../services/ankiService.mjs';

const router = Router();

router.post('/get-deck-words', async (req, res) => {
    const deckName = req.body.deckName;
    console.log(deckName);
    try {
        const words = await getWordsFromDeck(deckName); // Use the service to get words
        res.json({ words });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;