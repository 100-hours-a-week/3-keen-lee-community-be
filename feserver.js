const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors({ origin: 'http://127.0.0.1:5500' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'fnserver.html'));
});
app.get('/ex', (req, res) => {
    res.sendFile(path.join(__dirname, 'ex.html'));
});
app.get('/sinup', (req, res) => {
    res.sendFile(path.join(__dirname, 'sinup.html'));
});
app.get('/dialog', (req, res) => {
    res.sendFile(path.join(__dirname, 'dialog.html'));
});
app.get('/adddialog', (req, res) => {
    res.sendFile(path.join(__dirname, 'adddialog.html'));
});
app.get('/infochange', (req, res) => {
    res.sendFile(path.join(__dirname, 'infochange.html'));
});
app.get('/writingpage', (req, res) => {
    res.sendFile(path.join(__dirname, 'writingpage.html'));
});
app.get('/witingchange', (req, res) => {
    res.sendFile(path.join(__dirname, 'witingchange.html'));
});
app.get('/passwordcange', (req, res) => {
    res.sendFile(path.join(__dirname, 'passwordcange.html'));
});

app.listen(port, () => {
    console.log(`server start!! port ${port}`);
});
