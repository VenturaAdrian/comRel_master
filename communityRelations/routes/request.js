var express = require('express');
var bcrypt = require('bcrypt');
const router = express.Router();
var Sequelize = require('sequelize');
const multer = require('multer');


require('dotenv').config();

    var knex = require("knex")({
        client: 'mssql',
        connection: {
        user: process.env.USER,
        password: process.env.PASSWORD,
        server: process.env.SERVER,
        database: process.env.DATABASE,
        port: parseInt(process.env.APP_SERVER_PORT),
        options: {
            enableArithAbort: true,
        
        }
        },
    });

    var db = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD,{
      host: process.env.SERVER,
      dialect: "mssql",
      port: parseInt(process.env.APP_SERVER_PORT),
    });  

    const { DataTypes } = Sequelize;
    
    const Requests = db.define('requests_master',{
        request_id:{
            type:DataTypes.INTEGER,
            primaryKey: true
        },
        request_status:{
            type:DataTypes.STRING,
        },
        comm_Area:{
            type:DataTypes.STRING,          
        },
        comm_Act:{
            type: DataTypes.STRING,
        },
        date_Time:{
            type: DataTypes.STRING,
        },
        comm_Venue:{ 
            type:DataTypes.STRING,
        },
        comm_Guest:{
            type:DataTypes.STRING,
        },
        comm_Docs:{
            type:DataTypes.STRING,
        },
        comm_Emps:{
            type:DataTypes.STRING,
        },
        comm_Benef:{
            type:DataTypes.STRING,
        }
    },{
        freezeTableName: false,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        tableName: 'request_master'
    })

    

    router.get('/history', async(req,res,next)=>{
        console.log('/history mw was called')
        try{
            const data = await knex('request_master').select('*'); 
            res.json(data)
            console.log(data)
        }catch(err){
            console.error('ERROR FETCHING:', err);
                res.status(500).json({error: 'Failed fetch data'})
            }
    });

    router.get('/editform', async (req, res, next) => {
  const requestID = req.query.id; // get the requestID from query string
  try {
        const getRequest = await Requests.findAll({
            where:{
                request_id: req.query.id
            }
        })
        console.log(getRequest)


        const result = {
            request_id: getRequest[0].request_status
        }
        res.json(getRequest[0]);
  }catch(err){
    
  }

});

router.post('/updateform', async (req, res) => {
  try {
    const updated = await knex('request_master')
      .where({ request_id: req.body.request_id })
      .update({
        request_status: req.body.request_status,
        comm_Area: req.body.comm_Area,
        comm_Act: req.body.comm_Act,
        date_Time: req.body.date_Time,
        comm_Venue: req.body.comm_Venue,
        comm_Guest: req.body.comm_Guest,
        comm_Docs: req.body.comm_Docs,
        comm_Emps: req.body.comm_Emps,
        comm_Benef: req.body.comm_Benef,
        updated_by: 'user', // change if needed
        updated_at: new Date()
      });

    res.status(200).json({ message: 'Request updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

    var today = new Date();
    const DIR = './uploads';
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();


const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,DIR);
    },
    filename: function (req, file, cb) {
    const original = file.originalname.replace(/\s+/g, '_'); // replace spaces
    const uniqueName = `${new Date().toISOString().replace(/[:.]/g, '-')}_${original}`;
    cb(null, uniqueName);
  }
});
    const upload = multer({
        storage,
        limits: {fileSize: 150 * 1024 * 1024 } //150 MB
    });



router.post('/add-request-form', upload.array('comm_Docs'), async (req, res) => {
  const currentTimestamp = new Date();

  try {
    const {
      comm_Area,
      comm_Act,
      date_Time,
      comm_Venue,
      comm_Guest,
      comm_Emps,
      comm_Benef,
      created_by
    } = req.body;

    let docFilenames = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const { originalname, filename, mimetype, size } = file;
        docFilenames.push(filename);

        await knex('upload_master').insert({
          original_name: originalname,
          stored_name: filename,
          mime_type: mimetype,
          size: size,
          upload_date: currentTimestamp
        });
      }
    }

    await knex('request_master').insert({
      request_status: 'request',
      comm_Area,
      comm_Act,
      date_Time,
      comm_Venue,
      comm_Guest,
      comm_Docs: docFilenames.join(','),
      comm_Emps,
      comm_Benef,
      created_by,
      created_at: currentTimestamp,
      updated_by: '',
      updated_at: currentTimestamp
    });

    res.status(200).json({ message: 'Request added successfully' });
  } catch (err) {
    console.error('Error in backend:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



module.exports = router;