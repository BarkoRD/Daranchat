// DECLARACIONES DE ELEMENTOS

const newtextarea = document.getElementById("newinput");
const chatbox = document.getElementById("messageContainer");
const sendMessageBTN = document.getElementById("submit");
const online = document.querySelector(".online");
let accescodeactual = ""
const previewcamera = document.querySelector(".camera");
const sessionownername = document.querySelector(".sessionownername");



camera.addEventListener("click", (e) => {
  previewcamera.classList.remove("animacionadio");
  previewcamera.classList.remove("desactivado2");
  previewcamera.classList.add("animacion");
});

camera2.addEventListener("click", (e) => {
  previewcamera.classList.remove("animacion");
  previewcamera.classList.add("animacionadio");
});
//PEGAR IMAGENES

newtextarea.addEventListener('paste', (e) => {
  const pastedData = e.clipboardData;
  let firstelement = pastedData.items[0]

  let image = firstelement.getAsFile()
  let imageblob = blobconverter(image)

})



// DESTRUIR BACKGROUND

const erase = document.querySelector(".destroybg")

erase.addEventListener("click", () => {
  let userid = localStorage.getItem('userid')
  console.log(userid)
  socket.emit("client:eraserequest", userid)
})

socket.on("server:erasebg", () => {
  const chatbox = document.querySelector('.chatbox')
  chatbox.removeAttribute("style");
})

// MANEJA EL EVENTO DE SALIDA Y ENTRA DE USUARIOS
let sessionowner = String;
socket.on("sessionname", (name) => {

  sessionowner = name;
  sessionownername.innerHTML = sessionowner;
});

socket.on("updateOnlineUsers", (onlineUsers) => {
  online.innerHTML = onlineUsers;
});

// GUARDAR ID

socket.on('server:userid', userid => {
  localStorage.setItem('userid', userid);

})

//COLOCARLE EL TEMA QUE TENIA REFLEJADO EN LA BASE DE DATOS

socket.on('server:useraccescode', (useraccescode) => {

  accescodeactual = useraccescode;
  const accescode = useraccescode;

  socket.emit('client:useraccescode', accescode)
})

//CAMBIAR FONDO

const bginput = document.getElementById('change_bg')

bginput.addEventListener("change", (e) => {
  const selectedFile = e.target.files[0];

  if (selectedFile) {
    const bgchat = document.querySelector(".chatbox");
    let bgblob = blobconverter(selectedFile);

    bgchat.style.backgroundImage = `url('${URL.createObjectURL(bgblob)}')`;


    let data = [bgblob, accescodeactual]
    console.log(data[0])
    socket.emit('client:changebg', data)

  }
})

socket.on('server:userbg', bg => {
  const bgchat = document.querySelector(".chatbox");

  // Asegúrate de que 'bg' sea una cadena Base64 válida
  if (bg && typeof bg === 'string') {
    bgchat.style.backgroundImage = `url('data:image/jpeg;base64,${bg}')`;
  }
});

//CAMBIAR TEMA


socket.on('server:usertheme', theme => {
  console.log('theme')

  if (theme == "pink") {
    colorChange(pink);
  } else {
    theme == 'orange' ? colorChange(orange) : colorChange(turquoise);
  }
})

//CAMBIAR EL TEMA QUE SE VE REFLEJADO EN LA BASE DE DATOS

// orangetemplate
// pinktemplate
// turquoisetemplate


const formnewpass = document.getElementById('newPasswordRequest')

formnewpass.addEventListener('submit', async (e) => {
  e.preventDefault()

  const formData = new FormData(formnewpass);
  let newpass = formData.get('newpass')

  // let oldpass = formData.get('oldpass')
  const data = {
    newpass,
    // oldpass,
    id: localStorage.getItem("userid")
  }
  socket.emit('changepasstry', data)
  // socket.once('server:logout', (itwork) => {
  //   if (itwork) {
  //       if (confirm('Seras deslogueado desea continuar?')) {
  //         socket.emit('changepass', data)
  //         data.newpass = ''
  //         window.location.href = "/logout";
  //       }
  //   } else {
  //      alert('Por favor intente una contraseña diferente')
  //   }
  // })
})
socket.on('server:err', () => {
  alert('Por favor intente una contraseña diferente')
})

socket.on('server:logout', () => {
  if (confirm('Seras deslogueado desea continuar?')) 
    window.location.href = "/logout";
})
const formnewname = document.getElementById("newNameRequest")
formnewname.addEventListener('submit', (e) => {
  e.preventDefault()
  if (confirm('Seras deslogueado desea continuar?')) {
    const formData = new FormData(formnewname);
    console.log(formData)
    let newname = formData.get('newname')

    // let oldpass = formData.get('oldpass')
    const data = {
      newname,
      // oldpass,
      id: localStorage.getItem("userid")
    }
    socket.emit('changename', data)


    window.location.href = "/logout";
  }

})













turquoisetemplate.addEventListener('click', () => {
  data = ['turquoise', accescodeactual]
  socket.emit('client:changetheme', data)
})

orangetemplate.addEventListener('click', () => {
  data = ['orange', accescodeactual]
  socket.emit('client:changetheme', data)
})

pinktemplate.addEventListener('click', () => {
  data = ['pink', accescodeactual]
  socket.emit('client:changetheme', data)
})


//DETECTAR URLS EN LOS MENSAJES QUE SE MANDAN EN EL CHAT
const tourl = (text) => {
  const link =
    /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(?!www\.\S+\.\S{2,})((\b\w+\b\.\S{2,})\b)/g;
  return text.replace(link, (url) => {
    if (!url.startsWith("http")) {
      url = "http://" + url;
    }
    return `<a href="${url}" target="_blank">${url}</a>`;
  });
};


document.addEventListener("DOMContentLoaded", () => {
  history.pushState({}, "", "/");
  socket.emit("client:requestusername");
  setTimeout(() => {
    newtextarea.focus();
  }, 200);
});

newtextarea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();

    if (newtextarea.value.length <= 0) {
      chatbox.scrollTop = chatbox.scrollHeight;
    } else {
      setTimeout(() => {
        chatbox.scrollTop = chatbox.scrollHeight;
      }, 100)

      send.classList.add("disabled");
      rec.classList.remove("disabled");
      newtextarea.focus();
      sendMessage(newtextarea.value, undefined);
    }
  }
});

sendMessageBTN.addEventListener("click", (e) => {
  e.preventDefault();

  if (newtextarea.value.length <= 0) {
    e.preventDefault();
  } else {
    sendMessage(newtextarea.value, undefined);
  }
});

const sendMessage = (message, owner) => {
  let id = localStorage.getItem("userid");
  newtextarea.value = "";
  newtextarea.focus();
  // console.log(id + 'ELPEPE')
  socket.emit("client:newmessage", {
    message,
    owner,
    id,
  });
};

socket.on("server:reload", () => {
  window.location.reload(); // Actualizar la página en el cliente
});

const appendMessage = (message) => {
  if (message.type == "message") {
    mensaje = tourl(message.message);

    const div = document.createElement("div");

    div.classList.add("message");

    // console.log(localStorage.getItem("userid"))
    if (message.id !== localStorage.getItem("userid")) {
      div.classList.add("left");
      const owner = document.createElement("p");
      const messagediv = document.createElement("p");
      owner.classList.add("owner");
      messagediv.classList.add("content");
      owner.innerHTML = message.owner;
      messagediv.innerHTML = mensaje;
      owner.style.color = "var(--namecolors)";
      messagediv.style.backgroundColor = "var(--bgLeft)";
      messagediv.style.color = "var(--msgRight)";

      const owners = Array.from(chatbox.getElementsByClassName("owner"))
      const isLast = owners.pop()
      if (isLast?.innerHTML != message.owner) {
        div.append(owner);
      }
      div.append(messagediv);

    } else {

      div.classList.add("right");
      const owner = document.createElement("p");
      const messagediv = document.createElement("p");
      owner.classList.add("owner");
      messagediv.classList.add("content");
      owner.innerHTML = message.owner;
      messagediv.innerHTML = mensaje;
      owner.style.color = "var(--namecolors)";
      messagediv.style.backgroundColor = "var(--bgRight)";
      messagediv.style.color = "var(--msgRight)";

      if (!chatbox.lastElementChild?.classList.contains("right")) {
        div.append(owner);
      }
      div.append(messagediv);

    }
    chatbox.appendChild(div);
  } else {
    console.log("audio");
  }
  setTimeout(() => {
    chatbox.scrollTop = chatbox.scrollHeight;
  }, 100)
};



socket.on("server:newfile", (file) => {

  if (file.type == "file") {
    appendFile(file);

  } else {
    console.log("audio");
  }
});

const downloadrar = (blob) => {

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'DaranFile'
  return link

}



const appendFile = (file) => {
  blobfile = (blobconverter(file.file, file.format))
  let filesize = 0
  let filesizetipe = ''
  if (blobfile.size >= 1048576) {
    filesize = bytetomb(blobfile.size).toFixed(2)
    filesizetipe = ' MB'
  } else {
    filesize = bytetokb(blobfile.size).toFixed(2)
    filesizetipe = ' kB'
  }

  if (file.type == "file") {

    const div = document.createElement("div");

    div.classList.add("message");

    if (file.id !== localStorage.getItem("userid")) {
      div.classList.add("left");
      const owner = document.createElement("p");
      const messagediv = downloadrar(blobfile);
      messagediv.setAttribute("id", "filecontent")
      owner.classList.add("owner");
      messagediv.classList.add("content");
      owner.innerHTML = file.owner;

      owner.style.color = "var(--namecolors)";
      messagediv.style.backgroundColor = "var(--bgLeft)";
      messagediv.style.color = "var(--msgRight)";

      const svg = document.createElement("svg");
      svg.setAttribute("viewBox", "0 0 384 512");


      const path = document.createElement("path");
      path.setAttribute("d", "M384 128h-128V0L384 128zM256 160H384v304c0 26.51-21.49 48-48 48h-288C21.49 512 0 490.5 0 464v-416C0 21.49 21.49 0 48 0H224l.0039 128C224 145.7 238.3 160 256 160zM255 295L216 334.1V232c0-13.25-10.75-24-24-24S168 218.8 168 232v102.1L128.1 295C124.3 290.3 118.2 288 112 288S99.72 290.3 95.03 295c-9.375 9.375-9.375 24.56 0 33.94l80 80c9.375 9.375 24.56 9.375 33.94 0l80-80c9.375-9.375 9.375-24.56 0-33.94S264.4 285.7 255 295z");

      svg.appendChild(path);

      messagediv.innerHTML = `<svg class="svgoffile" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M384 128h-128V0L384 128zM256 160H384v304c0 26.51-21.49 48-48 48h-288C21.49 512 0 490.5 0 464v-416C0 21.49 21.49 0 48 0H224l.0039 128C224 145.7 238.3 160 256 160zM255 295L216 334.1V232c0-13.25-10.75-24-24-24S168 218.8 168 232v102.1L128.1 295C124.3 290.3 118.2 288 112 288S99.72 290.3 95.03 295c-9.375 9.375-9.375 24.56 0 33.94l80 80c9.375 9.375 24.56 9.375 33.94 0l80-80c9.375-9.375 9.375-24.56 0-33.94S264.4 285.7 255 295z"/></svg><p class="filesize">${filesize}<br>${filesizetipe}</p>`

      div.append(owner);
      div.append(messagediv);

    } else {

      div.classList.add("right");
      const owner = document.createElement("p");
      const messagediv = downloadrar(blobfile);
      messagediv.setAttribute("id", "filecontent")
      owner.classList.add("owner");
      messagediv.classList.add("content");
      owner.innerHTML = file.owner;

      owner.style.color = "var(--namecolors)";
      messagediv.style.backgroundColor = "var(--bgRight)";
      messagediv.style.color = "var(--msgRight)";

      const svg = document.createElement("svg");
      svg.setAttribute("viewBox", "0 0 384 512");


      const path = document.createElement("path");
      path.setAttribute("d", "M384 128h-128V0L384 128zM256 160H384v304c0 26.51-21.49 48-48 48h-288C21.49 512 0 490.5 0 464v-416C0 21.49 21.49 0 48 0H224l.0039 128C224 145.7 238.3 160 256 160zM255 295L216 334.1V232c0-13.25-10.75-24-24-24S168 218.8 168 232v102.1L128.1 295C124.3 290.3 118.2 288 112 288S99.72 290.3 95.03 295c-9.375 9.375-9.375 24.56 0 33.94l80 80c9.375 9.375 24.56 9.375 33.94 0l80-80c9.375-9.375 9.375-24.56 0-33.94S264.4 285.7 255 295z");

      svg.appendChild(path);

      messagediv.innerHTML = `<svg class="svgoffile" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M384 128h-128V0L384 128zM256 160H384v304c0 26.51-21.49 48-48 48h-288C21.49 512 0 490.5 0 464v-416C0 21.49 21.49 0 48 0H224l.0039 128C224 145.7 238.3 160 256 160zM255 295L216 334.1V232c0-13.25-10.75-24-24-24S168 218.8 168 232v102.1L128.1 295C124.3 290.3 118.2 288 112 288S99.72 290.3 95.03 295c-9.375 9.375-9.375 24.56 0 33.94l80 80c9.375 9.375 24.56 9.375 33.94 0l80-80c9.375-9.375 9.375-24.56 0-33.94S264.4 285.7 255 295z"/></svg><p class="filesize">${filesize}<br>${filesizetipe}</p>`

      if (!chatbox.lastElementChild?.classList.contains("right")) {
        div.append(owner);
      }
      div.append(messagediv);

    }
    chatbox.appendChild(div);
  } else {
    console.log("audio");
  }
  setTimeout(() => {
    chatbox.scrollTop = chatbox.scrollHeight;
  }, 100)
};

socket.on("server:newmessage", (message) => {

  if (message.type == "message") {
    appendMessage(message);
    newtextarea.value = "";
  } else {
    console.log("audio");
  }
});

socket.on("loadMessages", (messages) => {
  loadMessages(messages);
  // console.log(messages);
});

const loadMessages = (message) => {
  message.forEach((e) => {
    if (e.type === "audio") {
      const audioBlob = new Blob([e.audio], { type: "audio/mpeg" });
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
      appendAudio(audiobox, e.id, e.owner);
    } else if (e.type === "message") {
      appendMessage(e);
    } else if (e.type === "video") {

      const videoBlob = new Blob([e.video], { type: e.format || "video/webm" });
      const videoURL = URL.createObjectURL(videoBlob);

      const videoBox = document.createElement("video");
      videoBox.classList.add("videonote", "plyr");
      videoBox.src = videoURL;
      videoBox.controls = true;
      videoBox.id = "player";

      const videoContainer = document.createElement("div");
      videoContainer.classList.add("video-container");
      videoContainer.appendChild(videoBox);

      appendVideo(videoContainer, e.id, e.owner);
    } else if (e.type === "photo") {
      const photoBlob = new Blob([e.photo], { type: "image/jpeg" });
      const photoURL = URL.createObjectURL(photoBlob);

      const photoBox = document.createElement("img");
      photoBox.classList.add("photonote");
      photoBox.src = photoURL;

      const photoContainer = document.createElement("div");
      photoContainer.classList.add("photo-container");
      photoContainer.appendChild(photoBox);

      appendPhoto(photoContainer, e.owner, e.id);
    } else if (e.type == "file") {
      appendFile(e)
    }
  });
};

//

try {

  const ipRegAccescode = document.querySelector(".ip-reg-accescode");
  const ipRegName = document.querySelector(".ip-reg-name");
  const ipRegSubmit = document.querySelector(".ip-reg-submit");
  const errorbox = document.querySelector(".error-message");

  ipRegSubmit.addEventListener("click", (e) => {
    if (ipRegAccescode.value.length <= 0 || ipRegName.value.length <= 0) {
      e.preventDefault();
      console.log("asd");
      errorbox.innerHTML =
        "Verifique no haya dejado ningun campo vacio por favor";
    }
  });

} catch (e) {

}