const startVideoButton = document.querySelector('.grabarvideo');
const stopVideoButton = document.querySelector('.detenervideo');
const videoElement = document.querySelector('.videopreview');
let camera = document.querySelector('.abrircamara')
let camera2 = document.querySelector('.cerrarcamara')


let recordedChunks = [];



startVideoButton.addEventListener('click',()=>{
  startVideoButton.classList.toggle('desactivado')
  stopVideoButton.classList.toggle('desactivado')
})

stopVideoButton.addEventListener('click',()=>{
  startVideoButton.classList.toggle('desactivado')
  stopVideoButton.classList.toggle('desactivado')
})

camera.addEventListener('click', async (e) => {
  e.preventDefault();
  
  // Pedir permiso de cámara y micrófono
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

  // Mostrar la vista previa de la cámara en el elemento de video
  videoElement.srcObject = stream;
  videoElement.play();
  videoElement.muted = true;
});


const stopPreview = () => {
  const mediaStream = videoElement.srcObject;
  if (mediaStream) {
    const tracks = mediaStream.getTracks();
    tracks.forEach(track => track.stop());
    videoElement.srcObject = null;
  }
};

// Evento clic del botón "Detener grabación"
camera2.addEventListener('click', (e) => {
  e.preventDefault();
  
  // Detener la vista previa de la cámara
  stopPreview();
});





socket.on('server:newvideo',video =>{
  const videoBlob = new Blob([video.video], { type: video.format || 'video/webm' });
  const videoURL = URL.createObjectURL(videoBlob);

      // Crea un elemento "video vacio con los controles activados"
      const videoBox = document.createElement('video');
      videoBox.classList.add('videonote', 'plyr');
    
      videoBox.src = videoURL;
      videoBox.controls = true;
      videoBox.id= 'player'
    
     // Crea un contenedor para el video
      const videoContainer = document.createElement('div');
      videoContainer.classList.add('video-container');
      videoContainer.appendChild(videoBox);
  
      // Agrega el elemento de audio al DOM
      
    appendVideo(videoContainer,video.id,video.owner)
      
  
})

const appendVideo = (video,id,owner) => {
 
  let clientId = localStorage.getItem('userid');
  const videomessage = document.createElement('div');
  const div = document.createElement('div');
  const ownername = document.createElement('div');
  div.classList.add('message');
 
  ownername.innerHTML = `${owner}`

  
  if (id !== clientId) {
    div.classList.add('left');
    ownername.classList.add('owner');
    videomessage.appendChild(video);
    videomessage.classList.add('content')
    videomessage.classList.add('videostyle')
    div.appendChild(ownername)
    div.appendChild(videomessage)

    const player = new Plyr(video);

  } else {
    div.classList.add('right');
    ownername.classList.add('owner');
    videomessage.classList.add('content')
    videomessage.classList.add('videostyle')
    videomessage.appendChild(video);
    div.appendChild(ownername)
    div.appendChild(videomessage)
    const player = new Plyr(video);

  }
  recordingsList.appendChild(div);
};

stopVideoButton.addEventListener('click', (e) => {
  e.preventDefault();
  startVideoButton.disabled = false;
  stopVideoButton.disabled = true;
  mediaRecorder.stop();
});




// Evento clic del botón "Iniciar grabación de video"
startVideoButton.addEventListener('click', async (e) => {
  e.preventDefault();
  startVideoButton.disabled = true;
  stopVideoButton.disabled = false;
  chunks = [];

  // Pedir permiso de cámara y micrófono
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

  // Mostrar la vista previa de la cámara en el elemento de video
  videoElement.srcObject = stream;
  videoElement.play();

  // Crear el objeto MediaRecorder para grabar el video
  mediaRecorder = new MediaRecorder(stream);

  // Escuchar el evento de "dataavailable" para guardar los fragmentos de video
  mediaRecorder.addEventListener('dataavailable', (e) => {
    recordedChunks.push(e.data);
  });

  // Escuchar el evento de detener la grabación
  mediaRecorder.addEventListener('stop', () => {
    const viBlob = new Blob(recordedChunks, { type: 'video/webm' });
    let clientId = localStorage.getItem('userid');
    const sendVideo = (video, owner, id) => {
      console.log(video)
      socket.emit('client:newvideo', {
        video,
        owner,
        id
      })
    }
    console.log(viBlob)
    sendVideo(viBlob,'elpepe',clientId)

    recordedChunks = [];
    startVideoButton.disabled = false;
    stopVideoButton.disabled = true;


  });

  // Comienza la grabación de video
  mediaRecorder.start();
});

