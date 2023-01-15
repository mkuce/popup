const popupMessage = require('./popup.constants')
let express = require('express');
let path = require('path');

let app = express();

app.use(express.static('public'))

app.set('views', path.join(__dirname, 'demoSites'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/popup/confirmation', (req, res) => {
  setTimeout( _ => {
    if (Math.random() > 0.8) {
      return res.status(500).json({
        confirmationTracked: false
      })
    }
    res.json({
      confirmationTracked: true
    })
  }, Math.random() * 1000)
});

app.get('/popup', (req, res) => {
  setTimeout( _ => {
    if (Math.random() > 0.8) {
      return res.status(500).json({})
    }
    res.json({
      message: `<p>${popupMessage}</p>`
    })
  }, Math.random() * 1000)
});


app.listen(4000, () => console.log('Example app listening on port 4000!'));