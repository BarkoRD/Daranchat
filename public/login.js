

document.addEventListener('DOMContentLoaded',()=>{
  history.pushState({}, "", "/");
    const screenWidth = window.innerWidth;
    console.log(screenWidth)
    if (screenWidth >= 750) {
        const h1 = document.getElementById("h1");
      h1.innerHTML = "Iniciar Sesion"

    }
})

window.addEventListener('resize',()=>{
    const screenWidth = window.innerWidth;
    console.log(screenWidth)
    if (screenWidth >= 750) {
        const h1 = document.getElementById("h1");
      h1.innerHTML = "Iniciar Sesion"

    }
})