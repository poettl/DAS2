<script></script>;
// a) Set the background to a different color
document.body.style.backgroundColor = 'red';

// b) Display another image on the website
let img = document.createElement('img');
img.src =
  'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
document.getElementById('page').appendChild(img);

// c) Create a link on the website

let link = document.createElement('a');
link.href = 'https://www.google.com';
link.innerHTML = 'evil';
document.getElementById('page').appendChild(link);

// d) Defacing: Try to replace the site's html layout without using JavaScript

// without js?

window.open('https://google.com');
