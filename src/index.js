const path = require('path');
const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars');
const { dirname } = require('path');
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname,'public')))

app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())

// HTTP log
// app.use(morgan('combined'))
// Template engine
app.engine('hbs', exphbs({
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/news', (req, res) => {
  res.render('news');
})

app.get('/search', (req, res) => {
  res.render('search');
})

app.post('/search', (req, res) => {
  console.log(req.body);
  res.send('search');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})