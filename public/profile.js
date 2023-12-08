const changenameinput = document.getElementById("template_changename")
const changepassinput = document.getElementById("template_changepass")
const changenamesubmit = document.getElementById("changenamesubmit")
const changepasssubmit = document.getElementById("changepasssubmit")

let candaolabelname = false
let candaolabelpass = false

changenameinput.addEventListener("input", (e) => {
  if (changenameinput.value.length > 0) {
    candaolabelname = true
    changenamesubmit.classList.add("submitenabled")
    changenamesubmit.classList.remove("submitdisabled")
  } else if (changenameinput.value.length <= 0) {
    candaolabelname = false
    changenamesubmit.classList.add("submitdisabled")
    changenamesubmit.classList.remove("submitenabled")
  }
  console.log(candaolabelname)
})

changenamesubmit.addEventListener("click", (e) => {
  if (!candaolabelname) {
    e.preventDefault()
  }
})

changepassinput.addEventListener("input", (e) => {
  if (changepassinput.value.length > 0) {
    candaolabelpass = true
    changepasssubmit.classList.add("submitenabled")
    changepasssubmit.classList.remove("submitdisabled")
  } else if (changepassinput.value.length <= 0) {
    candaolabelpass = false
    changepasssubmit.classList.add("submitdisabled")
    changepasssubmit.classList.remove("submitenabled")
  }
})

changepasssubmit.addEventListener("click", (e) => {
  if (!candaolabelpass) {
    e.preventDefault()
  }
})
