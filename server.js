const express = require('express');
const fs = require('fs').promises; // Use promises for cleaner code
const path = require('path');
const app = express();
const PORT = 5000;

app.use(express.json());

const LIST_FILE = path.join(__dirname, 'list.txt');
const REGULARS_FILE = path.join(__dirname, 'regulars.txt');

// Helper to read files safely
const readFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return data.split('\n').filter(line => line.trim() !== '');
    } catch (err) {
        return []; // Return empty array if file doesn't exist yet
    }
};

// --- ROUTES ---

// Get both lists
app.get('/api/all', async (req, res) => {
    const shoppingList = await readFile(LIST_FILE);
    const regulars = await readFile(REGULARS_FILE);
    res.json({ shoppingList, regulars });
});

// Save Shopping List
app.post('/api/save-list', async (req, res) => {
    await fs.writeFile(LIST_FILE, req.body.list.join('\n'));
    res.send("List saved");
});

// Save Regular Buttons
app.post('/api/save-regulars', async (req, res) => {
    await fs.writeFile(REGULARS_FILE, req.body.regulars.join('\n'));
    res.send("Regulars saved");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));