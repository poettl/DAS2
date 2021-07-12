window.onload = () => {
  url = 'http://localhost:3000/google-login';
  let request = new XMLHttpRequest();
  request.open('GET', url);
  request.responseType = 'json';
  request.onload = () => {
    document.getElementById('googleBtn').addEventListener('click', () => {
      window.open(request.response.url);
    });
  };
  request.send();
};
