import express from "express"
import mongoose from 'mongoose'
import bodyParser from "body-parser"
import routes from './src/routes/crmRoutes'
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import jsonwebtoken from 'jsonwebtoken'

const app = express()

const PORT = 3000;

// helmet setup
app.use(helmet());

// Rate limit setup
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

//mongoose connection
mongoose.Promise = global.Promise; 
mongoose.connect('mongodb://localhost/CRMdb');

//bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// jwt setup
app.use((req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', (err, decode) => {
            if (err) req.user = undefined;
            else req.user = decode;
            next();
        });
    } else {
        req.user = undefined;
        next();
    }
});



// serving static files
app.use(express.static('public'));


routes(app);

app.get("/", (req, res) => {
    res.send(`Node and express server is running on port ${PORT}!`)
})

app.listen(PORT, () => {
    console.log(`Your server is running on port ${PORT}!`)
})