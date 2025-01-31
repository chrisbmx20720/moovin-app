function Post(file, onProgress) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('archivo_pdf', file);
  
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://127.0.0.1:8000/api/procesar-pdf/', true);
  
      // Enviar el archivo al servidor
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(new Error('Error en la carga del archivo'));
        }
      };
  
      xhr.onerror = () => reject(new Error('Error en la conexión'));
  
      // Iniciar la simulación de progreso
      let simulatedProgress = 0;
      const interval = setInterval(() => {
        simulatedProgress += 1; // Incrementar progreso
        onProgress(simulatedProgress); // Actualizar barra de carga
        if (simulatedProgress >= 100) {
          clearInterval(interval); // Detener progreso cuando llega al 100%
        }
      }, 75); // Incrementar cada 100ms (lo que lleva 10 segundos en total)
  
      // Enviar el archivo al servidor
      xhr.send(formData);
    });
  }
  
  export default Post;
  