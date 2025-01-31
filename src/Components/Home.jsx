import React, { useState } from 'react';
import Post from '../Services/Post';
import { DeterminateLoaderExample } from './Loader';

function Home() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const cargarFile = (e) => {
    setFile(e.target.files[0]);
  };

  async function enviar(e) {
    e.preventDefault();
    if (!file) {
      alert('Por favor, selecciona un archivo');
      return;
    }

    setIsUploading(true);
    setUploadPercentage(0); // Resetear el progreso

    try {
      await Post(file, (progress) => {
        setUploadPercentage(progress);
      });
      alert('Archivo enviado con éxito');
    } catch (error) {
      alert('Hubo un error al enviar el archivo');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="container">
      <h3>¡Transforma tu PDF a Drive!</h3>
      <form onSubmit={enviar}>
        <label htmlFor="fileInput">Sube tu archivo PDF:</label>
        <input id="fileInput" type="file" onChange={cargarFile} />
        <p>Sube tu archivo PDF y deja que nuestra plataforma lo transforme y lo lleve a Drive 🚀</p>
        <button type="submit">Enviar</button>
      </form>

      {/* Mostrar Loader si está cargando */}
      {isUploading && <DeterminateLoaderExample percentage={uploadPercentage} />}
    </div>
  );
}

export default Home;

