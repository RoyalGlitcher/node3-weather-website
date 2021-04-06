const path = require('path')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')
const express = require('express');
const hbs = require('hbs');
const cors = require('cors')

const app = express();

app.use(cors())

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Nathan'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Nathan'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'help message ;-;',
        title: 'Help',
        name: 'Nathan'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        res.setHeader("Access-Control-Allow-Origin", '*');
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorText: 'Help article not found',
        title: 'Error 404',
        name: 'Alice'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        errorText: 'Page not found',
        title: 'Error 404',
        name: 'Alice'
    })
})

app.listen(80, () => {
    console.log('Server is up on port 80.')
})