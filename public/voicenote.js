const socket = io();

const startButton = document.querySelector(".grabarnota");
const stopButton = document.querySelector(".cortarnota");
const recordingsList = document.querySelector(".messageContainer");

let mediaRecorder;
let chunks = [];

socket.on("server:newaudio", (audio) => {
  const audioBlob = new Blob([audio.audio], { type: "audio/mpeg" });
  const audioURL = URL.createObjectURL(audioBlob);
  // Crea un elemento "audio vacio con los controles activados"
  const audiobox = document.createElement("audio");
  audiobox.classList.add("voicenote", "plyr");
  audiobox.controls = true;
  audiobox.id = "player";
  // Crea un "source" que dentro tendra el link del blob ya transformado a audio
  const source = document.createElement("source");
  source.src = audioURL;
  source.type = "audio/mpeg";

  // une el source del audio con el elemento audio
  audiobox.appendChild(source);

  // Agrega el elemento de audio al DOM
  appendAudio(audiobox, audio.id, audio.owner);


  // Obtener el elemento por su clase
  let voiceNoteStyle = document.querySelector('.right .voicenotestyle');


  switch (actualColor) {
    case "rgb(0, 158, 158)":
      voiceNoteStyle.style.setProperty('--plyr-audio-controls-background', 'var(--bgRight)');
      voiceNoteStyle.style.setProperty('--plyr-range-thumb-background', 'var(--bgAside)');
      voiceNoteStyle.style.setProperty('--plyr-audio-range-track-background', 'var(--bgChat)');
      voiceNoteStyle.style.setProperty('--plyr-color-main', 'var(--bgChat)');
      voiceNoteStyle.style.setProperty('--plyr-audio-control-color', 'var(--bgChat)');
      voiceNoteStyle.style.setProperty('--plyr-audio-control-color-hover', 'var(--texto)');
      break;
    case "rgb(237, 125, 49)":
      voiceNoteStyle.style.setProperty('--plyr-audio-controls-background', 'var(--bgRightO)');
      voiceNoteStyle.style.setProperty('--plyr-range-thumb-background', 'var(--bgAsideO)');
      voiceNoteStyle.style.setProperty('--plyr-audio-range-track-background', 'var(--bgChatO)');
      voiceNoteStyle.style.setProperty('--plyr-color-main', 'var(--bgChatO)');
      voiceNoteStyle.style.setProperty('--plyr-audio-control-color', 'var(--bgChatO)');
      voiceNoteStyle.style.setProperty('--plyr-audio-control-color-hover', 'var(--textoO)');
      break;
    case "rgb(232, 237, 123)":
      voiceNoteStyle.style.setProperty('--plyr-audio-controls-background', 'var(--bgRightC)');
      voiceNoteStyle.style.setProperty('--plyr-range-thumb-background', 'var(--bgAsideC)');
      voiceNoteStyle.style.setProperty('--plyr-audio-range-track-background', 'var(--bgChatC)');
      voiceNoteStyle.style.setProperty('--plyr-color-main', 'var(--bgChatC)');
      voiceNoteStyle.style.setProperty('--plyr-audio-control-color', 'var(--bgChatC)');
      voiceNoteStyle.style.setProperty('--plyr-audio-control-color-hover', 'var(--textoC)');
      break;
  }




});

const appendAudio = (audio, id, owner) => {
  console.log(audio);
  let clientId = localStorage.getItem("userid");

  const voicenote = document.createElement("div");
  const div = document.createElement("div");
  const ownername = document.createElement("div");
  div.classList.add("message");

  ownername.innerHTML = `${owner}`;

  ownername.classList.add("owner");
  voicenote.classList.add("content");
  voicenote.classList.add("voicenotestyle");

  voicenote.appendChild(audio);
  div.appendChild(ownername);
  div.appendChild(voicenote);

  const player = new Plyr(audio, {
    speed: {
      selected: 1,
      options: [1, 1.5, 2],
    },
    controls: ["play", "progress", "duration", "settings"],
  });
  if (id !== clientId) {
    div.classList.add("left");
  } else {
    div.classList.add("right");
  }
  recordingsList.appendChild(div);
};

// Evento clic del botón "Detener grabación"

stopButton.addEventListener("click", (e) => {
  let elementos = [newtextarea, option1, option2, option3, cameraButtonOn];
  elementos[0].placeholder = 'Mensaje'
  elementos.forEach((e)=>{
      e.style.pointerEvents = 'auto';
  
  })
  e.preventDefault();

  mediaRecorder.stop();
});

//Evento clic del botón "Iniciar grabación"

startButton.addEventListener("click", async (e) => {
  e.preventDefault();
  let elementos = [newtextarea, option1, option2, option3, cameraButtonOn];
  elementos[0].placeholder = 'Grabando audio...'
  elementos.forEach((e)=>{
      e.style.pointerEvents = 'none';
  
  })
  chunks = [];

  // pedir permiso de microfono
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // se establece que se recibira audio microfono o video o etc
  mediaRecorder = new MediaRecorder(stream);

  // escucha el evento de "grabando" de media recorder y comienza
  // a guardar el audio en chunks(el array)

  mediaRecorder.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
    
  });

  // escucha el evento de detener la grabacion aqui dentro se convierte el
  // contenido de chunks a un "blob" un blob es un conjunto de datos binarios
  // que se puede transformar en algo en este caso este blob se transformara en audio
  // el blob transformado se metera dentro de un link
  mediaRecorder.addEventListener("stop", () => {
    const blob = new Blob(chunks, { type: "audio/mpeg" });
    let clientId = localStorage.getItem("userid");
    const sendAudio = (audio, owner, id) => {
      socket.emit("client:newaudio", {
        audio,
        owner,
        id,
      });
    };
    sendAudio(blob, "elpepe", clientId);

    // Limpia los datos y restablece los botones
    chunks = [];
  });

  // Comienza la grabación   
  mediaRecorder.start();
});

// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK

//   Si deseas que se muestre la duración del audio sin tener que reproducirlo, puedes utilizar el evento 'loadedmetadata' del reproductor Plyr para obtener la duración y actualizar el elemento correspondiente en la interfaz.

// Aquí tienes un ejemplo de cómo hacerlo:

// const player = new Plyr(audio, {
//   speed: {
//     selected: 1,
//     options: [1, 1.5, 2]
//   },
//   controls: ['play', 'progress', 'duration', 'settings']
// });

// player.on('loadedmetadata', () => {
//   const durationElement = document.querySelector('.plyr__time--duration');
//   const duration = player.duration;
//   if (durationElement && duration) {
//     durationElement.textContent = formatTime(duration);
//   }
// });

// // Función para formatear el tiempo en formato hh:mm:ss
// function formatTime(time) {
//   const hours = Math.floor(time / 3600);
//   const minutes = Math.floor((time % 3600) / 60);
//   const seconds = Math.floor(time % 60);
//   return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
// }

//   En este ejemplo, estamos escuchando el evento 'loadedmetadata' del reproductor Plyr, que se dispara cuando se obtienen los metadatos del audio, incluida la duración. En el controlador de eventos, obtenemos el elemento correspondiente a la duración ('.plyr__time--duration') y actualizamos su contenido con el valor formateado de la duración.

// Asegúrate de tener un elemento en tu HTML con la clase 'plyr__time--duration' para mostrar la duración del audio.

// Con esta solución, la duración del audio se mostrará sin necesidad de reproducirlo previamente.

// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
