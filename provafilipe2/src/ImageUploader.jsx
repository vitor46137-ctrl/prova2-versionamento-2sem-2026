import React, { useState } from 'react';
//import { db } from './firebase'; //
//import { collection, addDoc } from 'firebase/firestore'; //

export default function ImageUploader() {
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Função para adicionar notificações visuais
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      addNotification('Por favor, selecione uma imagem primeiro.', 'error');
      return;
    }

    setIsUploading(true);

    // Prepara o arquivo para envio multipart
    const formData = new FormData();
    formData.append('imagem', image); // O nome 'imagem' deve ser igual ao @RequestParam("imagem") do Java

    // ID fictício para preencher o {userId} da rota do seu professor
    const userId = "aluno_p2"; 

    try {
      // Faz a requisição para a porta padrão do Spring Boot (8080)
      const resposta = await fetch(`http://localhost:8080/api/alunos/${userId}/imagem`, {
        method: 'POST',
        body: formData, 
      });

      if (resposta.ok) {
        // Dispara a sua notificação VERDE de sucesso!
        addNotification('Sucesso! Imagem processada pelo Spring Boot.');
        setImage(null); 
        document.getElementById('file-input').value = '';
      } else {
        addNotification('Erro ao processar o upload no servidor.', 'error');
      }

    } catch (error) {
      console.error(error);
      addNotification('Não foi possível conectar ao backend Spring Boot.', 'error');
    } finally {
      setIsUploading(false); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Upload de Imagens</h2>
        
        <div className="mb-4">
          <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer flex items-center justify-center w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            Escolher arquivo
          </label>
          {image && <p className="mt-2 text-sm text-gray-600 text-center">{image.name}</p>}
        </div>

        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-colors ${
            isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isUploading ? 'Enviando...' : 'Fazer Upload'}
        </button>
      </div>

      {/* Sistema de Notificações que flutua no ecrã */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`px-4 py-3 rounded-md shadow-lg text-white transition-all transform translate-y-0 ${
              notif.type === 'error' ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {notif.message}
          </div>
        ))}
      </div>
    </div>
  );
}