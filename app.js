const express = require('express');
const cryptoRandomString = require('crypto-random-string');
const createHttpError = require("http-errors")
const mongoose = require('mongoose')
const path = require('path');
const ShortUrl = require('./models/url.model')

const app = express();
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017', {
    dbName: 'js-url-shortener',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('mongoose connected'))
.catch(error => console.log('error connecting to mongodb'))

app.set('view engine', 'ejs')

app.get('/', async (req, res, next) => {
    res.render('index')
})

app.post('/', async (req, res, next) => {
    try {
        const {url} = req.body
        if (!url) {
            throw createHttpError.BadRequest('Provide a valid url')
        }
        const urlExist = await ShortUrl.findOne({url})
        if (urlExist) {
            res.render('index', {
                //use this once domain is set up
                //short_url: `${req.hostname}/${urlExist.shortId}`,
                short_url: `http://localhost:3000/${urlExist.shortId}`,
            })
            return
        }
        const str = cryptoRandomString({length: 8, type: 'url-safe'});
        const shortUrl = new ShortUrl({url: url, shortId: str})
        const result = await shortUrl.save()
        res.render('index', {
            //use this once domain is set up
            //short_url: `${req.hostname}/${urlExist.shortId}`,
            short_url: `http://localhost:3000/${result.shortId}`,
        })
    } catch (error) {
        next(error)
    }
})

app.get('/:shortId', async (req,res,next) => {
    try {
    const {shortId} = req.params
    const result = await ShortUrl.findOne({shortId})
    if (!result) {
        throw createHttpError.NotFound('Short url does not exist')
    }
    res.redirect(result.url)
    } catch (error) {
        next(error)
    }
    
  

})

app.use((req, res, next) => {
    next(createHttpError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('index', {error: err.message})
})

app.listen(3000, () => console.log('Server is on port 3000'));


// Other JS

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
  }
  
  function showButton() {
    let isEmpty = document.getElementById('short-url').innerHTML === "";
    if (isEmpty) {
        isEmpty.classList.remove("copy-link-hide");
    }
 }