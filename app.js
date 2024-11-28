const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Configuración para leer datos del cuerpo de las peticiones
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia si usas un usuario diferente
    password: 'JoHaN19082003', // Cambia si tienes contraseña
    database: 'proyecto_final' 
});

// Verifica si la conexión a la base de datos fue exitosa
db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Configuración para servir archivos estáticos como CSS
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ruta principal: lista de usuarios
app.get('/', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).send('Error al obtener usuarios');
        }
        res.render('list', { usuarios: results });
    });
});

// Ruta para mostrar el formulario de creación
app.get('/create', (req, res) => {
    res.render('create');
});

// Ruta para agregar un usuario
app.post('/create', (req, res) => {
    const { nombre, correo, numero_cuenta, escuela } = req.body;
    const query = 'INSERT INTO usuarios (nombre, correo, numero_cuenta, escuela) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, correo, numero_cuenta, escuela], (err) => {
        if (err) {
            console.error('Error al agregar usuario:', err);
            return res.status(500).send('Error al agregar usuario');
        }
        res.redirect('/');
    });
});

// Ruta para mostrar el formulario de edición
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM usuarios WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener usuario:', err);
            return res.status(500).send('Error al obtener usuario');
        }
        res.render('edit', { usuario: results[0] });
    });
});

// Ruta para actualizar un usuario
app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, correo, numero_cuenta, escuela } = req.body;
    const query = 'UPDATE usuarios SET nombre = ?, correo = ?, numero_cuenta = ?, escuela = ? WHERE id = ?';
    db.query(query, [nombre, correo, numero_cuenta, escuela, id], (err) => {
        if (err) {
            console.error('Error al actualizar usuario:', err);
            return res.status(500).send('Error al actualizar usuario');
        }
        res.redirect('/');
    });
});

// Ruta para eliminar un usuario
app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM usuarios WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            return res.status(500).send('Error al eliminar usuario');
        }
        res.redirect('/');
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
