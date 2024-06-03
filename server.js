const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const dbPath = path.resolve(__dirname, 'database.sqlite3');
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado ao banco de dados SQLite.');
});

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)`);

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await getUser(username);
        if (!user || user.password !== password) {
            return res.status(401).send('Usuário ou senha incorretos.');
        }
        res.redirect('http://localhost:3000/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor.');
    }
});

app.post('/cadastro', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await getUser(username);
        if (existingUser) {
            return res.status(400).send('Este usuário já está cadastrado.');
        }
        await insertUser(username, password);
        res.status(200).send('Usuário cadastrado com sucesso!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao cadastrar usuário.');
    }
});

function getUser(username, password) { // Apenas username como parâmetro
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username, password], (err, row) => { // Removido password do array
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

async function insertUser(username, password) {
    try {
        await new Promise((resolve, reject) => {
            db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html')); // Ajustado para enviar o arquivo dashboard.html corretamente
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
