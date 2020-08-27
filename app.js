const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
global.bcrypt = require('bcrypt')
global.SALT_ROUNDS = 10
const careprovidersRouter = require('./routes/careproviders')
const familiesRouter = require('./routes/families')
const membersRouter = require('./routes/members')
const medicationRouter = require('./routes/medications')
const indexRouter = require('./routes/index')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const labresultsRouter = require('./routes/testlabs')
const notesRouter = require('./routes/notes')
const insuranceRouter = require('./routes/insurance')
const appointmentsRouter = require('./routes/appointments')
const aboutRouter = require('./routes/about')
const calendarRouter = require('./routes/calendar')

const profileRouter = require('./routes/profile')

const PORT = process.env.PORT || 8080
require('dotenv').config()
const path = require('path')
const VIEWS_PATH = path.join(__dirname,'/views')
global.session = require("express-session")
const checkAuthorization = require('./middlewares/authorization')

app.use(session({
    secret: "secreto",
    resave: true,
    saveUninitialized: false
}))


global.models = require("./models")
global.__basedir = __dirname 


function auth(req,res,next) {
    if(req.session.isAuth) {
        next()
    } else {
        res.redirect("/")
    }
}

app.use('/uploads', express.static('uploads'))
app.use('/css', express.static('css'))
// changed the public static folder
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))

app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
app.set('views',VIEWS_PATH)
app.set('view engine', 'mustache')
app.use('/index', indexRouter)
app.use('/register',registerRouter)
app.use('/login', loginRouter)
app.use('/labresults', checkAuthorization, labresultsRouter)
app.use('/insurance', checkAuthorization, insuranceRouter)
app.use('/careproviders',checkAuthorization, careprovidersRouter)
app.use('/families',checkAuthorization, familiesRouter)
app.use('/members', checkAuthorization, membersRouter)
app.use('/medications',checkAuthorization, medicationRouter)
app.use('/profile', profileRouter)
app.use('/notes', notesRouter)
app.use('/appointment', appointmentsRouter)
app.use('/about', aboutRouter)
app.use('/calendar', calendarRouter)

app.listen(PORT, ()=>{
    console.log("Server is running...")
})