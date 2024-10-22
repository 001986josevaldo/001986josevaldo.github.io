
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando acesso à câmera...');

    const mainBox = document.querySelector('.main-box'); 

    if (!mainBox) {
        console.error('Elemento .main-box não encontrado');
        return;
    }

    const videoElement = document.createElement('video');
    videoElement.style.width = '100%';
    videoElement.style.height = 'auto';
    mainBox.appendChild(videoElement); 
// ---------------------------------------------------
    const imgElement = document.createElement('img');
    imgElement.style.width = '100%';
    imgElement.style.height = 'auto';
    // Inicialmente, ocultamos o elemento img, já que vamos mostrar o vídeo primeiro
    imgElement.style.display = 'none'; 
    mainBox.appendChild(imgElement); 
// -----------------------------------------

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            videoElement.srcObject = stream;
            videoElement.play();
            console.log('Câmera iniciada com sucesso.');
            startProcessing();
        })
        .catch(function(error) {
            console.error('Erro ao acessar a câmera: ', error);
        });
    } else {
        console.error('getUserMedia não é suportado no seu navegador.');
    }

    function startProcessing() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        setInterval(function() {
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(function(blob) {
                const formData = new FormData();
                formData.append('image', blob, 'frame.jpg');

                fetch('http://localhost:5000/process_image', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro na requisição: ' + response.status);
                    }
                    return response.blob();  // Recebe a imagem como blob
                })
                .then(blob => {
                    // Converte o blob para uma URL e atualiza o src do imgElement
                    const imageUrl = URL.createObjectURL(blob);
                    imgElement.src = imageUrl;

                    // Libera a URL do objeto quando não for mais necessária
                    imgElement.onload = () => {
                        URL.revokeObjectURL(imageUrl);
                    };
                     // Quando a imagem processada é recebida, ocultamos o vídeo e mostramos a imagem
                    videoElement.style.display = 'none';
                    imgElement.style.display = 'block';
                })
                .catch(error => {
                    console.error('Erro ao processar a resposta:', error);
                });
            }, 'image/jpeg');
        }, 100);
    }
});