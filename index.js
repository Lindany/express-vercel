const express = require('express');

const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const app = express();

app.use(helmet());

app.use(compression());

const SwaggerJsDoc = require('swagger-jsdoc')
const SwaggerUI = require('swagger-ui-express')
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
});

// Load the MySQL pool connection
const pool = require('./data/config');

const PORT = process.env.PORT || 8080

console.log('Hello, world!');

// Swagger docs connection
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Gazelle Creek Technologies - Access Control API',
            description: "This is the endpoint to get the results and also update from the pi to the database, \
                          and also to and fro admin website interface. This is where we get admin http://access-control.gctza.co.za/ \
                         url, in this dashboard we view all the access control stats and summary of the users. This is were we also insert \
                         and manage the tenants and visitors, also extract timesheet records.\
                        ",
            contact: {
                name: "Lindani Mabaso | Gazelle Creek Technologies"
            },
            servers: ["http://localhost:8080"]
        }
    },
    // ['.routes/*.js']
    apis: ["./*.js"]
};

const swaggerDocs = SwaggerJsDoc(swaggerOptions);

app.use(express.json())
app.use('/docs', SwaggerUI.serve, SwaggerUI.setup(swaggerDocs));
app.options('*', cors()) // include before other routes

//============================================= SCHEMA =================================


  
//============================================= GET =================================

//Get All The User Details
/**
 * @swagger
 * /userdetails:
 *  get:
 *    description: Get all the user details from the UserTbl
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: no users found response
 */
app.get('/userdetails',(request, response) =>{

    pool.query(`select * from UserTbl`, (err, result) => {
        if (err) {
            return err;
        }
        response.status(200).send(result);
    })
   
});

//Get All The Visitors
/**
 * @swagger
 * /visitors:
 *  get:
 *    description: Get all the visitor details from the VisitorTbl
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: no visitors found response
 */
 app.get('/visitors',(request, response) =>{

    pool.query(`select * from VisitorTbl`, (err, result) => {
        if (err) {
            return err;
        }
        response.status(200).send(result);
    })
   
});



//Get All The Visitors
/**
 * @swagger
 * /visitor/:visitorId:
 *  get:
 *    description: Get all the visitor details from the VisitorTbl
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: no visitors found response
 */
 app.get('/visitors',(request, response) =>{
    const { visitorId } = request.params;

    pool.query(`select * from VisitorTbl where visitorID=?`,visitorId, (err, result) => {
        if (err) {
            return err;
        }
        response.status(200).send(result);
    })
   
});


//============================================= UPDATE =================================

/**
 * @swagger
 * /customers:
 *    put:
 *      description: Get
 *    parameters:
 *      - name: customer
 *        in: query
 *        description: Name of our customer
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully created user
 */
app.put('/test/:id',(req,res) =>{

    const {id} = req.params;
    const {logo} = req.body;

    if(!logo){
        res.status(418).send({
            message : 'We need a logo'
        })
    }
    
    res.send({
        message : `Succssfuly sent ${logo} message ${id} `,
    })
});

//============================================= POST / INSERT =================================

//Login Validation INSERT INTO gctzapmw_access_control_db.UserTbl
//(tenantID, lastName, firstName, email, occupation, online, tagID, hours, temperature, `role`, gender, ethnicity, accessType, status, username, password, biometricID, faceID)
//VALUES(NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL);

/**
 * @swagger
 * /login:
 *  post:
 *    summary: login
 *    consumes:
 *      - application/json
 *    description: validate the credentials
 *    parameters:
 *      - in: body
 *        name: user
 *        description: Email and Password to match existing user
 *        schema:
 *            type: object
 *            properties:
 *               email: 
 *                 type: string
 *               password:
 *                 type: string
 *    responses:
 *      '201':
 *        description: A successful response
 *      '404':
 *        description: no credentials found
 */

 app.post('/login/',(request, response) =>{
    const email =  request.body.email.value;
    const password= request.body.password.value;
    console.log("Email:", email)
    console.log("Password:",password)

    pool.query(`select * from UserTbl where email=?`,email,(err, result) => {
        console.log("Results:",result[0].password)

        if (err) {
            console.log("err:", err)
            return err;
        }
        if(result[0].password != password){
            response.status(401).send("Unaurthorized, invalid password")
        }
        response.status(200).send(result);
    })
   
});


//============================================= POST / INSERT| [ UserTbl ] =================================

/**
 * @swagger
 * /registeruser:
 *  post:
 *    summary: populate userTbl
 *    consumes:
 *      - application/json
 *    description: add a new user / registration
 *    parameters:
 *      - in: body
 *        name: user
 *        description: Register a new user
 *        schema:
 *            type: object
 *            properties:  
 *               lastName: 
 *                 type: string
 *               firstName:
 *                 type: string
 *               email: 
 *                 type: string
 *               occupation:
 *                 type: string
 *               online: 
 *                 type: integer
 *               tagID:
 *                 type: string
 *               gender: 
 *                 type: string
 *               ethnicity:
 *                 type: string
 *               username: 
 *                 type: string
 *               biometricID:
 *                 type: string
 *               faceID: 
 *                 type: string
 *               password:
 *                 type: string
 *               tenantID:
 *                 type: integer
 *    responses:
 *      '201':
 *        description: A successful response
 *      '404':
 *        description: no credentials found
 */

 app.post('/registeruser/',(request, response) =>{
    const tenantID= request.body.tenantID;
    const email =  request.body.email;
    const password= request.body.password;
    const lastName =  request.body.lastName;
    const firstName =  request.body.firstName;
    const occupation =  request.body.occupation;
    const online =  request.body.online;
    const tagID =  request.body.tagID;
    const gender =  request.body.gender;
    const ethnicity =  request.body.ethnicity;
    const username =  request.body.username;
    const biometricID =  request.body.biometricID;
    const faceID =  request.body.faceID;
    const defaultZero = 0
    console.log(request.body)
    var sql = `INSERT INTO UserTbl
    (tenantID, lastName, firstName, email, occupation, online, tagID, hours, temperature, gender, ethnicity, accessType, status, username, password, biometricID, faceID) VALUES 
    (${tenantID}, '${lastName}', '${firstName}', '${email}', '${occupation}', ${online}, '${tagID}', '${defaultZero}', ${defaultZero}, '${gender}', '${ethnicity}', ${defaultZero}, ${defaultZero}, '${username}', '${password}', '${biometricID}',' ${faceID}') `;

    pool.query(sql,(err, result) => {
        console.log("Results:",result)

        if (err) {
            console.log("err:", err)
            return err;
        }
        response.status(200).send(result);
    })
   
});

//============================================= BUCKETS ========================================

//============================================= GET ========================================

//Get A specific bucket info.
/**
 * @swagger
 * /buckets/:userId:
 *  get:
 *    summary: Get bucket info
 *    consumes:
 *      - application/json
 *    description: Get the specific bucket from the GyserTbl
 *    parameters:
 *      - in: path
 *        name: userId
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: no visitors found response
 */
 app.get('/buckets/:userId',(request, response) =>{
    const { userId } = request.params;

    pool.query(`select * from GyserTbl gt WHERE gt.userId=?`,userId, (err, result) => {
        if (err) {
            return err;
        }
        response.status(200).send(result);
    })   
});

//============================================= POST BUCKET ========================================


/**
 * @swagger
 * /updatebucket:
 *  put:
 *    summary: updatebucket gyser
 *    consumes:
 *      - application/json
 *    description: update bucket temperature and scheduling
 *    parameters:
 *      - in: body
 *        name: bucket
 *        description: update bucket temperature and scheduling
 *        schema:
 *            type: object
 *            properties:
 *               userId: 
 *                 type: integer
 *               currentTemp:
 *                 type: integer
 *               limitTemp:
 *                 type: integer
 *               scheduleTime:
 *                 type: number
 *    responses:
 *      '201':
 *        description: A successful response
 *      '404':
 *        description: no credentials found
 */

 app.put('/updatebucket',(request, response) =>{
    const userId =  request.body.userId;
    const currentTemp= request.body.currentTemp;
    const limitTemp =  request.body.limitTemp;
    const scheduleTime= request.body.scheduleTime;

    console.log(request.body)
    var sql = `UPDATE GyserTbl
    SET  currentTemp=${currentTemp}, limitTemp=${limitTemp}, scheduleTime=${scheduleTime}
    WHERE userId=${userId} `;

    pool.query(sql,(err, result) => {
        console.log("Results:",result)

        if (err) {
            console.log("err:", err)
            return err;
        }
        response.status(200).send(result);
    })
   
});


//============================================= UPDATE CURRENT TEMP BUCKET ========================================


/**
 * @swagger
 * /setcurrenttemp/:currentTemp/:userId:
 *  put:
 *    summary: update current temperature gyser
 *    consumes:
 *      - application/json
 *    description: update bucket CURRENT temperature
 *    parameters:
 *      - in: query
 *        name: currentTemp
 *      - in: query
 *        name: userId
 *        description: update bucket CURRENT temperature
 *        schema:
 *          properties:
 *            userId: 
 *              type: integer
 *            currentTemp:
 *              type: integer
 *    responses:
 *      '201':
 *        description: A successful update of temperature response
 *      '404':
 *        description: failed to update temperature
 */

 app.put('/setcurrenttemp/:currentTemp/:userId',(request, response) =>{
    const { currentTemp } = request.params;
    const { userId } = request.params;

    console.log("\n\n\nRequest param: ",request.params)
    console.log("\n\n\ncurrentTemp: ", currentTemp)

    var sql = `UPDATE GyserTbl
    SET  currentTemp=${currentTemp}
    WHERE userId=${userId} `;

    pool.query(sql,(err, result) => {
        console.log("Results:",result)

        if (err) {
            console.log("err:", err)
            return err;
        }
        response.status(201).send(result);
    })
   
});


/**
 * @swagger
 * /setlimittemp/:limitTemp/:userId:
 *  put:
 *    summary: update limit temperature gyser
 *    consumes:
 *      - application/json
 *    description: update bucket MAXIMUM temperature
 *    parameters:
 *      - in: query
 *        name: maxTemperature
 *      - in: query
 *        name: userId
 *        description: update bucket CURRENT temperature
 *        schema:
 *          properties:
 *            userId: 
 *              type: integer
 *            currentTemp:
 *              type: integer
 *    responses:
 *      '201':
 *        description: A successful update of temperature response
 *      '404':
 *        description: failed to update temperature
 */

 app.put('/setlimittemp/:limitTemp/:userId',(request, response) =>{
    const { limitTemp } = request.params;
    const { userId } = request.params;

    console.log("\n\n\nRequest param: ",request.params)
    console.log("\n\n\limitTemp: ", limitTemp)

    var sql = `UPDATE GyserTbl
    SET  limitTemp=${limitTemp}
    WHERE userId=${userId} `;

    pool.query(sql,(err, result) => {
        console.log("Results:",result)

        if (err) {
            console.log("err:", err)
            return err;
        }
        response.status(201).send(result);
    })
   
});
//============================================= DELETE ========================================

//============================================= START =========================================
app.listen(PORT, () => { 
    var host = app
    var port = PORT
    
    console.log("App listening at http://%s:%s", host, port)
})
