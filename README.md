# httphound

A working example of a an API returning HAL+JSON media type and a client consuming it. (Inspired by [http://httpstatusdogs.com](http://httpstatusdogs.com))

## Usage

1. Clone the repo
2. Go to the server directory
3. Type `node app.js`
4. Go to client directory
5. Type `python -m SimpleHTTPServer 8998`
6. Open browser at `http://localhost:8998`
7. Enjoy!
8. Realise everything on screen is coming from a HAL response and the client JavaScript code is displaying all elements from said response eg/ next, previous, home links, images, text....

![](https://httpdog.com/images/200.jpg)
