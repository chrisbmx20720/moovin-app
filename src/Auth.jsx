const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');

const SCOPES = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/documents'];
const TOKEN_PATH = 'token.json';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Cargar las credenciales
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content), createGoogleDoc);
});

// Autorizar la aplicación
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]
  );

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

// Solicitar un nuevo token de acceso
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  rl.question('Enter the code from that page here: ', (code) => {
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

// Crear un documento de Google Docs
function createGoogleDoc(auth) {
  const docs = google.docs({ version: 'v1', auth });
  const requestBody = {
    title: 'Nuevo Documento',
  };

  docs.documents.create({
    requestBody: requestBody,
  }, (err, res) => {
    if (err) return console.log('Error creating document: ', err);
    console.log('Documento creado con ID: ', res.data.documentId);
    addTextToDoc(auth, res.data.documentId);
  });
}

// Agregar texto al documento de Google Docs
function addTextToDoc(auth, documentId) {
  const docs = google.docs({ version: 'v1', auth });
  const requests = [
    {
      insertText: {
        location: {
          index: 1,
        },
        text: 'Aquí van los datos del PDF extraídos...',
      },
    },
  ];

  docs.documents.batchUpdate({
    documentId: documentId,
    requestBody: {
      requests: requests,
    },
  }, (err, res) => {
    if (err) return console.log('Error appending text: ', err);
    console.log('Texto agregado al documento.');
  });
}
