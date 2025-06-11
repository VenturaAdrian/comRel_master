var express = require('express');
var bcrypt = require('bcrypt');
const router = express.Router();
var Sequelize = require('sequelize');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
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
        },
        created_by:{
          type:DataTypes.STRING,
        },
        created_at:{
          type:DataTypes.STRING
        },
        comment_id:{
          type:DataTypes.STRING
        }
    },{
        freezeTableName: false,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        tableName: 'request_master'
    })

    //VIEW HISTORY
    router.get('/history', async(req,res,next)=>{
      try{
        const data = await knex('request_master').select('*'); 
        res.json(data)
        console.log(data)
      }catch(err){
        console.error('ERROR FETCHING:', err);
        res.status(500).json({error: 'Failed fetch data'})
        }
    });



    const DIR = './uploads';

    const storage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null,DIR);
        },
        filename: function (req, file, cb) { 
        const original = file.originalname.replace(/\s+/g, '_'); 
        const uniqueName = `${new Date().toISOString().replace(/[:.]/g, '-')}_${original}`;
        cb(null, uniqueName);
        }
    });

    const upload = multer({
        storage,
        limits: {fileSize: 150 * 1024 * 1024 } //150 MB
    });

    const currentTimestamp = new Date();


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
      created_by,
      comment_id
    } = req.body;

    let docFilename = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const { mimetype, originalname, filename } = file;
        const filePath = path.join(DIR, filename);
        docFilename.push(filename)

        await knex('upload_master').insert({
          upload_type: mimetype,
          file_path: filePath,
          file_name: originalname,
          upload_date: currentTimestamp,
          upload_by: created_by,
          updated_by: created_by,
          updated_at: currentTimestamp
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
      comm_Docs: docFilename.join(','), // matches upload_master.comm_Docs
      comm_Emps,
      comm_Benef,
      comment_id: '',
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
    // FETCH ALL VALUES VIA REQUEST_ID
    router.get('/editform', async (req, res, next) => {
  try {
        const getRequest = await Requests.findAll({
            where:{
                request_id: req.query.id
            }
        })
        console.log(getRequest)
        res.json(getRequest[0]);
  }catch(err){
    
  }

});

router.post('/updateform',upload.array('comm_Docs'), async (req, res) => {


    const {
      created_by
    } = req.body;
  
     let docFilenames = [];
    console.log('createdby value: ', created_by)
  if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const { originalname, filename, mimetype, } = file;
        docFilenames.push(filename);
        const filePath = path.join(DIR, filename);
      
        await knex('upload_master').insert({
          upload_type: mimetype,
          file_path: filePath,
          file_name: originalname,
          upload_date: currentTimestamp,
          upload_by: created_by,
          updated_by: 'asdasd',
          updated_at: currentTimestamp
        });
      }
    }
    

  try {
    await knex('request_master')
      .where({ request_id: req.body.request_id })
      .update({
        request_status: req.body.request_status,
        comm_Area: req.body.comm_Area,
        comm_Act: req.body.comm_Act,
        date_Time: req.body.date_Time,
        comm_Venue: req.body.comm_Venue,
        comm_Guest: req.body.comm_Guest,
        comm_Docs: docFilenames.join(','),
        comm_Emps: req.body.comm_Emps,
        comm_Benef: req.body.comm_Benef,
        updated_by: created_by,
        updated_at: currentTimestamp
      });

    res.status(200).json({ message: 'Request updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update request' });
  }
});


const Comments = db.define('comment_master',{
        comment_id:{
            type:DataTypes.INTEGER,
            primaryKey: true
        },
        comment:{
          type:DataTypes.STRING
        },
        created_by:{
          type:DataTypes.STRING
        },
        created_at:{
          type:DataTypes.STRING
        },
        request_id:{
          type: DataTypes.INTEGER
        }
    },{
        freezeTableName: false,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        tableName: 'request_master'
    })

  // GET comments for a specific request
router.get('/comment/:request_id', async (req, res) => {
  try {
    const request_id = req.params.request_id;
    const comments = await knex('comment_master')
      .where({ request_id })
      .orderBy('created_at', 'desc');
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

// POST a new comment
router.post('/comment', async (req, res) => {
  try {
    const { comment, created_by, request_id } = req.body;
    const created_at = new Date();

    await knex('comment_master').insert({
      comment,
      created_by,
      created_at,
      request_id
    });

    res.status(200).json({ message: 'Comment added successfully' });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});


router.post('/comment-decline', async function (req, res, next) {
  const currentTimestamp = new Date();
  const {
    request_status,
    request_id,
    currentUser
  } = req.body;

  try {
    await knex('request_master')
      .where({ request_id: request_id })
      .update({
        request_status,
        updated_by: currentUser,
        updated_at: currentTimestamp
      });

    res.status(200).json({ message: 'Request status updated successfully' });
  } catch (err) {
    console.error('Error updating request status:', err);
    res.status(500).json({ message: 'Failed to update request status' });
  }
});

module.exports = router;