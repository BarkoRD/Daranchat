window.addEventListener("keydown", function (e) {
  if (e.key == "Tab") {
    e.preventDefault()
  }
})

const sendPhoto = (photo, owner, id, photosrc) => {
  if (photosrc) {
    socket.emit("client:newphoto", {
      photosrc,
      owner,
      id,
    })
  } else {
    socket.emit("client:newphoto", {
      photo,
      owner,
      id,
    })
  }
}

const sendVideo = (video, owner, id, format) => {
  console.log(video + "se intento enviar al servidor")
  socket.emit("client:newvideo", {
    video,
    owner,
    id,
    format,
  })
}

const sendAudio = (audio, owner, id) => {
  socket.emit("client:newaudio", {
    audio,
    owner,
    id,
  })
}

const sendFile = (file, owner, id, format) => {
  socket.emit("client:newfile", {
    file,
    owner,
    id,
    format,
  })
}

const slides = document.querySelectorAll(".general-container")

let currentSlide = 0

slides.forEach((e) => {
  e.addEventListener("click", (event) => {
    event.stopPropagation()
  })
})

const showSlide = (index) => {
  slides.forEach((slide, i) => {
    if (i === index) {
      slide.style.transform = "translateX(0)"
    } else {
      slide.style.transform = "translateX(100%)"
    }
  })
}

showSlide(currentSlide)

const option1 = document.getElementById("option1")
const option2 = document.getElementById("option2")
const option3 = document.getElementById("option3")
const optionsContainer = document.querySelector("options-container")

option1.addEventListener("click", (e) => {
  e.stopPropagation()
  currentSlide = 1

  showSlide(currentSlide)
})

option2.addEventListener("click", () => {
  currentSlide = 2

  showSlide(currentSlide)
})

option3.addEventListener("click", () => {
  currentSlide = 3

  showSlide(currentSlide)
})

document.addEventListener("click", (e) => {
  if (
    e.target !== optionsContainer &&
    e.target !== option1 &&
    e.target !== option2 &&
    e.target !== option3 &&
    e.target !== slides[1] &&
    e.target !== slides[2] &&
    e.target !== slides[3]
  ) {
    currentSlide = 0

    showSlide(currentSlide)
  }
})

const bytetomb = (byte) => {
  const mb = byte / (1024 * 1024)
  return mb
}

const bytetokb = (byte) => {
  const kb = byte / 1024
  return kb
}
const blobconverter = (file, fileformat) => {
  if (fileformat) {
    const blob = new Blob([file], { type: file.type || fileformat })
    return blob
  } else {
    const blob = new Blob([file], { type: file.type })
    return blob
  }
}

// Subir archivos mediante el clip
// Subir archivos mediante el clip
// Subir archivos mediante el clip
// Subir archivos mediante el clip
// Subir archivos mediante el clip
// Subir archivos mediante el clip

const uploadedFile = document.getElementById("uploadFile")
uploadedFile.addEventListener("click", (e) => {
  console.log(e.target.files)
})
uploadedFile.addEventListener("change", (e) => {
  payaso = blobconverter(e.target.files[0])

  console.log(payaso)

  let userid = localStorage.getItem("userid")

  if (payaso.type.startsWith("image/")) {
    sendPhoto(payaso, "elpepe", userid)
  } else if (payaso.type.startsWith("video/")) {
    sendVideo(payaso, "elpepe", userid, payaso.type)
  } else {
    sendFile(payaso, "elpepe", userid, payaso.type)
    // downloadrar(payaso)
  }
  e.target.value = null
})

// Subir foto mediante copypaste
// Subir foto mediante copypaste
// Subir foto mediante copypaste
// Subir foto mediante copypaste
// Subir foto mediante copypaste
// Subir foto mediante copypaste

let newtextareaa = document.getElementById("newinput")
newtextareaa.addEventListener("paste", (e) => {
  const pastedData = e.clipboardData
  let firstelement = pastedData.items[0]
  console.log(firstelement)

  if (firstelement.kind === "string" && firstelement.type === "text/html") {
    firstelement.getAsString((htmlString) => {
      const doc = new DOMParser().parseFromString(htmlString, "text/html")
      const imgSrc = doc.querySelector("img")?.src
      let userid = localStorage.getItem("userid")
      //   console.log(imgSrc)
      // fetch(imgSrc)
      //   .then(response => response.blob())
      //   .then(blob => {

      sendPhoto(undefined, "elpepe", userid, imgSrc)
      // })
    })
  } else if (firstelement.kind === "file") {
    console.log("entroalfifle")
    let userid = localStorage.getItem("userid")

    let image = firstelement.getAsFile()

    let imageblob = blobconverter(image)
    sendPhoto(imageblob, "elpepe", userid)
  }
})

const root = document.documentElement
const turquoise = {
  bgChat: "#0F3333",
  bgAside: "#2B2E2F",
  bgLeft: "#005252",
  bgRight: "#009E9E",
  // msgColor: "#fff",
  hover: "#5e5e5e71",
  texto: "#009E9E",

  msgRight: "#fff",
  msgLeft: "#fff",
  namecolors: "#009E9E",
}
const orange = {
  bgChat: "#6C5F5B",
  bgAside: "#4F4A45",
  bgLeft: "#7D4219",
  bgRight: "#ED7D31",
  // msgColor: "#fff",
  hover: "#5e5e5e71",
  texto: "#ED7D31",

  msgRight: "#fff",
  msgLeft: "#fff",
  namecolors: "#ED7D31",
}

const pink = {
  bgChat: "#C97F7F",
  bgAside: "#EFB495",
  bgLeft: "#EBEF95",
  bgRight: "#e8ed7b",
  // msgColor: "#333333",
  hover: "#5e5e5e71",
  texto: "#e8ed7b",

  msgRight: "#333333",
  msgLeft: "#333333",
  namecolors: "#e8ed7b",
}

// Función para cambiar los valores de las variables
const colorChange = (newValue) => {
  Object.keys(newValue).forEach((e) => {
    root.style.setProperty(`--${e}`, newValue[e])
  })
}

//    CAMBIOS REALIZADOS: CREACION DE UNA FUNCION QUE RETORNA UN ARRAY CON TODOS LOS ELEMENTOS QUE CAMBIARAN DE COLOR
const actualizador = () => {
  const chatBg = document.querySelector(".chatbox")
  const asideBg = document.getElementById("theaside")
  const textNButtonBg = document.querySelector(".text_N_button")
  const leftBg = document.querySelectorAll(".left")
  const rightBg = document.querySelectorAll(".right")
  const onlinecolor = document.querySelector(".p_online")
  const ownerColor = document.querySelectorAll(".owner")
  const bold = document.querySelectorAll(".bold")
  const svgColor = document.querySelectorAll(".svgColor")
  const text = document.querySelectorAll(".content")
  const lorem = document.querySelector(".lorem")
  const ponlinetext = document.querySelector(".ponlinetext")
  const turquoisetemplate = document.getElementById("turquoisetemplate")
  const orangetemplate = document.getElementById("orangetemplate")
  const pinktemplate = document.getElementById("pinktemplate")
  const voiceNoteStyle = document.querySelector(".voicenotestyle")

  return [
    chatBg,
    asideBg,
    textNButtonBg,
    leftBg,
    rightBg,
    onlinecolor,
    ownerColor,
    bold,
    svgColor,
    text,
    lorem,
    ponlinetext,
    turquoisetemplate,
    orangetemplate,
    pinktemplate,
    voiceNoteStyle,
  ]
}

//  CAMBIOS REALIZADOS: CREACION DE LAS VARIABLES USANDO DESESTRUCTURACION DE DATOS
let [
  chatBg,
  asideBg,
  textNButtonBg,
  leftBg,
  rightBg,
  onlinecolor,
  ownerColor,
  bold,
  svgColor,
  text,
  lorem,
  ponlinetext,
  turquoisetemplate,
  orangetemplate,
  pinktemplate,
  voiceNoteStyle,
] = actualizador()
let actualColor = document.getElementById("pinktemplate")

turquoisetemplate.addEventListener("click", () => {
  const elementos = actualizador()
  ;[
    chatBg,
    asideBg,
    textNButtonBg,
    leftBg,
    rightBg,
    onlinecolor,
    ownerColor,
    bold,
    svgColor,
    text,
    lorem,
    ponlinetext,
    turquoisetemplate,
    orangetemplate,
    pinktemplate,
    voiceNoteStyle,
  ] = elementos

  colorChange(turquoise)
})

orangetemplate.addEventListener("click", () => {
  const elementos = actualizador()
  ;[
    chatBg,
    asideBg,
    textNButtonBg,
    leftBg,
    rightBg,
    onlinecolor,
    ownerColor,
    bold,
    svgColor,
    text,
    lorem,
    ponlinetext,
    turquoisetemplate,
    orangetemplate,
    pinktemplate,
    voiceNoteStyle,
  ] = elementos

  colorChange(orange)
})

pinktemplate.addEventListener("click", () => {
  const elementos = actualizador()
  ;[
    chatBg,
    asideBg,
    textNButtonBg,
    leftBg,
    rightBg,
    onlinecolor,
    ownerColor,
    bold,
    svgColor,
    text,
    lorem,
    ponlinetext,
    turquoisetemplate,
    orangetemplate,
    pinktemplate,
    voiceNoteStyle,
  ] = elementos

  colorChange(pink)
})

const container = document.querySelector(".messageContainer")
const submit = document.getElementById("submit")
const texto = document.getElementById("input")
const recButton = document.querySelector("cameraButton")
const cameraBox = document.querySelector(".camera")
const info = document.querySelector(".info")
const cameraButtonOn = document.querySelector(".cameraButtonOn")
const cameraButtonOff = document.querySelector(".cameraButtonOff")
const messageButtonOn = document.querySelector(".messageButtonOn")
const messageButtonOff = document.querySelector(".messageButtonOff")

container.scrollTop = container.scrollHeight

cameraButtonOn.addEventListener("click", () => {
  cameraButtonOn.classList.toggle("disabled")
  cameraButtonOff.classList.toggle("disabled")

  info.classList.add("animate__fadeOut")

  setTimeout(() => {
    info.classList.add("disabled")
  }, 200)
  setTimeout(() => {
    cameraBox.classList.remove("animate__slideOutDown")
    cameraBox.classList.add("animate__slideInUp")
    cameraBox.classList.remove("disabled")
  }, 300)
})

cameraButtonOff.addEventListener("click", () => {
  cameraButtonOn.classList.toggle("disabled")
  cameraButtonOff.classList.toggle("disabled")
  info.classList.remove("animate__fadeOut")

  setTimeout(() => {
    info.classList.remove("disabled")
    info.classList.add("animate__fadeIn")
  }, 500)

  cameraBox.classList.remove("animate__slideInUp")

  cameraBox.classList.add("animate__slideOutDown")
  setTimeout(() => {
    cameraBox.classList.add("disabled")
  }, 500)
})

messageButtonOn.addEventListener("click", () => {
  messageButtonOn.classList.toggle("disabled")
  messageButtonOff.classList.toggle("disabled")
})

messageButtonOff.addEventListener("click", () => {
  messageButtonOn.classList.toggle("disabled")
  messageButtonOff.classList.toggle("disabled")
})

const newinput = document.getElementById("newinput")
const rec = document.querySelector(".rec")
const send = document.querySelector(".send")

newinput.addEventListener("input", (e) => {
  if (e.target.value.trim().length == 0) {
    send.classList.add("disabled")
    rec.classList.remove("disabled")
  } else {
    send.classList.remove("disabled")
    rec.classList.add("disabled")
  }
})

let lastScrollTop = 0;
const scrollTriggerPercentage = 25;


const chatboxtoscroll = document.getElementById('messageContainer')

chatboxtoscroll.addEventListener("scroll",()=>{
  let scrollTop = chatboxtoscroll.scrollTop

  let scrollPercentage = (scrollTop / (chatboxtoscroll.scrollHeight - chatboxtoscroll.clientHeight)) * 100;
  

  if (scrollTop < lastScrollTop && scrollPercentage <= scrollTriggerPercentage) {
    tonewmessages.classList.remove("disabled")
}else{
  tonewmessages.classList.add("disabled")
}

lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

})

const tonewmessages = document.getElementById('tonewmessages')

tonewmessages.addEventListener('click',(e)=>{
  e.preventDefault
  chatboxtoscroll.scrollTop = chatboxtoscroll.scrollHeight;
})