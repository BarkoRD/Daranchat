// const MySQLStore = require('express-mysql-session')(session);
let pepe = console.log
// const sessionStore = new MySQLStore(/* configuración de MySQLStore */);
//?????????????????????????????????????????????????????????????????????????????????????

const express = require("express")
const { pool, query } = require("./database.js")
const app = express()
const cookieParser = require("cookie-parser")
const session = require("express-session")
const { Server: SServer } = require("socket.io")
const http = require("http")

//NODE MIDDLEWARES

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser("suricata"))
const sessionMiddleware = session({
  secret: "gatocalvo",
  resave: true,
  saveUninitialized: true,
})
app.use(sessionMiddleware)

const messages = []

const server = http.createServer(app)

const io = new SServer(server, {
  maxHttpBufferSize: 100 * 1024 * 1024,
})

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next)
})

var useraccescode = ""
let onlineUsers = 0

io.on("connection", async (socket) => {
  const sessionweb = socket.request.session
  let sessionname = sessionweb.name
  let userid = sessionweb.userid
  let theme = sessionweb.usertheme

  let bg = sessionweb.userbg

  socket.emit("server:userid", userid)

  console.log("New Connection:", socket.id)
  onlineUsers++
  io.emit("updateOnlineUsers", onlineUsers)

  socket.emit("sessionname", sessionname)

  socket.emit("server:useraccescode", useraccescode)
  socket.emit("server:userbg", bg)
  socket.emit("server:usertheme", theme)

  socket.on("client:eraserequest", async (userid) => {
    const results = await pool
      .promise()
      .query('UPDATE chatters set background_picture = "" WHERE id = ?', [
        userid,
      ])
    sessionweb.userbg = ""
    sessionweb.save()
    socket.emit("server:erasebg")
  })

  socket.on("client:changetheme", async (data) => {
    const results = await pool
      .promise()
      .query("UPDATE chatters set theme = ? WHERE accesscode = ?", [
        data[0],
        data[1],
      ])
    sessionweb.usertheme = data[0]
    sessionweb.save()
  })

  socket.on("client:changebg", async (data) => {
    const results = await pool
      .promise()
      .query(
        "UPDATE chatters set background_picture = ? WHERE accesscode = ?",
        [data[0], data[1]]
      )
    let base64String = ""
    if (Buffer.isBuffer(data[0])) {
      base64String = data[0].toString("base64")
    }
    sessionweb.userbg = base64String
    sessionweb.save()
  })

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id)

    // Decrementar el contador de usuarios en línea
    onlineUsers--
    io.emit("updateOnlineUsers", onlineUsers)
  })

  socket.emit("loadMessages", messages)
  console.log(messages)
  socket.on("client:newmessage", (message) => {
    if (sessionweb.loggedin) {
      let msgWithOwner = {
        owner: sessionweb.name,
        message: message.message,
        id: message.id,
        type: "message",
      }

      console.log(msgWithOwner)
      messages.push(msgWithOwner)

      io.sockets.emit("server:newmessage", msgWithOwner)
    } else {
      io.sockets.emit("server:reload") // Enviar evento de recarga
    }
  })

  socket.on("client:newaudio", (audio) => {
    let audioWithOwner = {
      audio: audio.audio,
      owner: sessionweb.name,
      id: audio.id,
      type: "audio",
    }

    console.log(audioWithOwner)
    messages.push(audioWithOwner)

    io.sockets.emit("server:newaudio", audioWithOwner)
  })

  socket.on("client:newphoto", (photo) => {
    let photoWithOwner = {
      photo: photo.photo,
      owner: sessionweb.name,
      id: photo.id,
      type: "photo",
      photosrc: photo.photosrc,
    }
    console.log(photoWithOwner)
    messages.push(photoWithOwner)

    io.sockets.emit("server:newphoto", photoWithOwner)
  })

  socket.on("client:newvideo", (video) => {
    console.log(video.format)
    let videoWithOwner = {
      video: video.video,
      owner: sessionweb.name,
      id: video.id,
      type: "video",
      format: video.format,
    }

    console.log(videoWithOwner)
    messages.push(videoWithOwner)

    io.sockets.emit("server:newvideo", videoWithOwner)
  })

  socket.on("client:newfile", (file) => {
    console.log(file)
    let fileWithOwner = {
      file: file.file,
      owner: sessionweb.name,
      id: file.id,
      type: "file",
      format: file.format,
    }

    console.log(fileWithOwner)
    messages.push(fileWithOwner)

    io.sockets.emit("server:newfile", fileWithOwner)
  })

  socket.on("client:requestusername", () => {
    let username = session.name
    socket.emit("server:username", username)
  })

  socket.on("changepass", async (data) => {
    const [pepe] = await pool
      .promise()
      .query("SELECT * FROM chatters WHERE accesscode = ?", [data.newpass])
    try {
      await pool
        .promise()
        .query("UPDATE chatters SET accesscode = ? WHERE chatters.id = ?", [
          data.newpass,
          data.id,
        ])
      socket.emit("server:logout")
    } catch (e) {
      socket.emit("server:err")
    }
  })

  socket.on("changename", async (data) => {
    // pepe(data)
    const [pepito] = await pool
      .promise()
      .query("UPDATE chatters SET name = ? WHERE chatters.id = ?", [
        data.newname,
        data.id,
      ])
    pepe(pepito)
  })
})

// MANEJO DE SOLICITUDES ALA PAGINA
app.get("/", (req, res) => {
  res.redirect("/index")
})

app.get("/index", async (req, res) => {
  if (req.session.loggedin) {
    let error = ""

    res.render("index", { error })
  } else {
    const error = "ingrese su codigo de acceso para acceder al chat"
    res.render("login", { error })
  }
})

app.get("/login", async (req, res) => {
  if (req.session.loggedin) {
    let error = ""

    res.render("index", { error })
  } else {
    const error = "ingrese su codigo de acceso para acceder al chat"
    res.render("login", { error })
  }
})

app.get("/register", async (req, res) => {
  let error = ""
  res.render("register", { error: error })
})

app.post("/register", async (req, res) => {
  const { name, accesscode } = req.body
  const newdata = { name, accesscode }
  const [data] = await pool
    .promise()
    .query("SELECT * FROM chatters WHERE accesscode = ?", [accesscode])
  if (data.length > 0) {
    let error = "Disculpe este codigo de acceso no esta disponible"
    res.render("register", { error: error })
  } else {
    await pool.promise().query("INSERT INTO chatters SET ?", newdata)
    res.redirect("/login")
  }
})

//req es un objeto que almacena los datos de la peticion
//cosas como la informacion que se envia en esa peticion por ejemplo

//req == peticion
//res == respuesta

app.post("/login", async (req, res) => {
  const accesscode = req.body.accesscode
  useraccescode = accesscode
  const [data] = await pool
    .promise()
    .query("SELECT * FROM chatters WHERE accesscode = ?", [accesscode])

  if (data.length > 0) {
    req.session.name = data[0].name
    req.session.userbg = data[0].background_picture // Esta es la imagen en Buffer
    req.session.userid = data[0].id
    req.session.usertheme = data[0].theme
    req.session.loggedin = true

    // Convertir el Buffer a Base64
    let base64String = ""
    if (Buffer.isBuffer(req.session.userbg)) {
      base64String = req.session.userbg.toString("base64")
    }

    // Agregar la cadena Base64 a la sesión
    req.session.userbg = base64String

    res.redirect("/index")
  } else {
    const error = "Contraseña incorrecta"
    res.render("login", { error })
  }
})

app.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/login")
})

server.listen(process.env.PORT || 3000, () => {
  console.log("si")
})

// app.get('/', (req, res) => {
//     // Configuración del encabezado para indicar que la respuesta es JSON
//     res.setHeader('Content-Type', 'application/json');

//     // Cuerpo de la respuesta
//     const responseData = {
//       message: '¡Hola desde Express!',
//       timestamp: Date.now()
//     };

//     // Edita la respuesta y envía el cuerpo JSON
//     res.json(responseData);
//   });



