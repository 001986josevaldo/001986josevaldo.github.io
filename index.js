console.log('Iniciando acesso à câmera...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando acesso à câmera...');

    // Seleciona o elemento .main-box no HTML
    const mainBox = document.querySelector('.main-box'); 

    // Verifica se o mainBox existe
    if (!mainBox) {
        console.error('Elemento .main-box não encontrado');
        return;
    }

    // Cria o elemento de vídeo e define suas propriedades
    const videoElement = document.createElement('video');
    videoElement.style.width = '100%'; // Ajusta a largura do vídeo
    videoElement.style.height = 'auto'; // Ajusta a altura do vídeo
    mainBox.appendChild(videoElement); // Anexa o vídeo à .main-box

    // Verifica se o navegador suporta o getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Pede permissão ao usuário para acessar a câmera
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            // Define o stream da câmera como a fonte do elemento de vídeo
            videoElement.srcObject = stream;
            videoElement.play(); // Inicia o vídeo automaticamente
            console.log('Câmera iniciada com sucesso.');
        })
        .catch(function(error) {
            // Exibe erro no console caso não consiga acessar a câmera
            console.error('Erro ao acessar a câmera: ', error);
        });
    } else {
        console.error('getUserMedia não é suportado no seu navegador.');
    }
});