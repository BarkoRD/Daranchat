const modal = document.getElementById('modalWindow')

document.addEventListener('click', (e) => {
  const img = e.target.classList.contains('photonote') ? e.target : 0
  if (img) {
    modal.style.display = 'block'
    modal.querySelector('img').setAttribute('src', img.getAttribute('src'))
  } else {
    modal.style.display = 'none'
  }
})