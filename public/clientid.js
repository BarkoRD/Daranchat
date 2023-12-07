window.addEventListener('keydown', function(e) {
  if (e.key == 'Tab') {
      e.preventDefault();
  }
});

const generateUniqueId = () => {
  const toid = Math.random() * 123432;
  const id = Math.round(toid);
  return id;
};

const clientId = () => {

    document.addEventListener('DOMContentLoaded', () => {
      let clientId = localStorage.getItem('clientId');
      if (!clientId) {
        clientId = generateUniqueId();
        localStorage.setItem('clientId', clientId);
      }
      console.log('id:',clientId,'obtenido correctamente');
    });
  }

  clientId();

const app = () => {
  const script = document.createElement('script');
  script.src = `app.js?${generateUniqueId()}`;
  document.body.appendChild(script);
}