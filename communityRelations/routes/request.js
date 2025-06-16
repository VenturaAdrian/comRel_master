var express = require('express');
var bcrypt = require('bcrypt');
const router = express.Router();
var Sequelize = require('sequelize');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');                // <== Needed for fs.existsSync
const fsp = require('fs/promises');
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
        data.forEach(row => console.log(row.request_status));
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

    const currentTimestamp = new Date().toISOString();

router.get('/fetch-request-id', async (req, res) => {
  try {
    const data = await knex('request_master').select('*');
    res.json(data);
  } catch (err) {
    console.error('Error fetching all requests:', err);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});    

router.get('/fetch-upload-id', async (req, res) => {
  try {
    const data = await knex('upload_master').select('*');
    res.json(data);
    
  } catch (err) {
    console.error('Error fetching all upload-id:', err);
    res.status(500).json({ message: 'Failed to fetch upload-id' });
  }
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

    let docFilename = [];

    // 1. Insert the request first
    const [newRequest] = await knex('request_master')
      .insert({
        request_status: 'request',
        comm_Area,
        comm_Act,
        date_Time,
        comm_Venue,
        comm_Guest,
        comm_Docs: '',
        comm_Emps,
        comm_Benef,
        comment_id: '',
        created_by,
        created_at: currentTimestamp,
        updated_by: '',
        updated_at: currentTimestamp
      })
      .returning('request_id');

    const request_id = newRequest.request_id || newRequest; // for MSSQL compatibility

    let uploadIdToSave = null;

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const { mimetype, originalname, filename } = file;
        const filePath = path.join(DIR, filename);
        docFilename.push(filename);

        const [upload] = await knex('upload_master')
          .insert({
            request_id,
            upload_type: mimetype,
            file_path: filePath,
            file_name: originalname,
            upload_date: currentTimestamp,
            upload_by: created_by,
            updated_by: created_by,
            updated_at: currentTimestamp
          })
          .returning('id_number');

        const id_number = upload.id_number || upload;

        if (i === 0) {
          uploadIdToSave = id_number;
        }
      }

      // 2. Update the request_master with file list + upload_id of first file
      await knex('request_master')
        .where({ request_id })
        .update({
          comm_Docs: docFilename.join(','),
          upload_id: uploadIdToSave,
          updated_at: currentTimestamp
        });
    }

    res.status(200).json({ message: 'Request added successfully', request_id, upload_id: uploadIdToSave });
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
    console.error('Error fetching edit form data:', err);
    res.status(500).json({ error: 'Failed to fetch request' });
  }

});

router.post('/updateform', upload.array('comm_Docs'), async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    const {
      request_id,
      created_by,
      request_status,
      comm_Area,
      comm_Act,
      date_Time,
      comm_Venue,
      comm_Guest,
      comm_Emps,
      comm_Benef,
    } = req.body;

    // Validate required fields
    if (!request_id || !created_by) {
      console.error("Missing required parameters");
      return res.status(400).json({ error: "Missing request_id or created_by" });
    }

    // Ensure `created_by` is always a valid string (handles arrays)
    const updatedByValue = Array.isArray(created_by) ? created_by[0] : String(created_by || 'Unknown');

    // Handle file uploads correctly
    const docFilenames = req.files?.map(file => file.filename) || [];

    // Execute database update
    await knex('request_master')
      .where({ request_id })
      .update({
        request_status,
        comm_Area,
        comm_Act,
        date_Time,
        comm_Venue,
        comm_Guest,
        comm_Docs: docFilenames.length > 0 ? docFilenames.join(',') : knex.raw('comm_Docs'), // Keep existing documents if none are uploaded
        comm_Emps,
        comm_Benef,
        updated_by: updatedByValue, // Ensure `created_by` is stored as a string
        updated_at: new Date(),
      });

    console.log("Update successful:", request_id);
    res.status(200).json({ message: "Request updated successfully" });

  } catch (err) {
    console.error("Database Update Error:", err);
    res.status(500).json({ error: "Failed to update request", details: err.message });
  }
});

router.get('/delete-request', async(req,res,next) => {
    try{
        const request_id = req.query.request_id;
        if(!request_id){
          return res.status(400).json({error: 'Request ID is required'});
        }
       
      await knex('upload_master').where({request_id}).del();

        await knex('comment_master').where({request_id}).del();
        
        await knex('request_master').where({request_id}).del();

        res.status(200).json({message: 'Request deleted successfully'});
    }catch(err){
      console.error(err);
      res.status(500).json({error: ' Failed to delete the request'})
    }
})


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
        tableName: 'comment_master'
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

router.post('/accept', async (req, res, next) => {
  const currentTimestamp = new Date();
  const { request_status, request_id, currentUser } = req.body;

  try {
    
    const [requestData] = await knex('request_master')
      .select('comm_Docs')
      .where({ request_id });

    if (!requestData) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const filenames = requestData.comm_Docs
      ? requestData.comm_Docs.split(',').map(f => f.trim()).filter(f => f)
      : [];

    const baseDir = path.join('./uploads', `request_${request_id}`);
    const imagesDir = path.join(baseDir, 'images');
    const docsDir = path.join(baseDir, 'documents');

    await fsp.mkdir(imagesDir, { recursive: true });
    await fsp.mkdir(docsDir, { recursive: true });

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    for (const file of filenames) {
      const ext = path.extname(file).toLowerCase();
      const srcPath = path.join('./uploads', file);
      const destFolder = imageExtensions.includes(ext) ? imagesDir : docsDir;
      const destPath = path.join(destFolder, file);

      try {
        if (fs.existsSync(srcPath)) {
          await fsp.rename(srcPath, destPath);
          console.log(`Moved file: ${file}`);
        } else {
          console.warn(`Skipping missing file: ${srcPath}`);
        }
      } catch (moveErr) {
        console.error(`Failed to move file ${file}:`, moveErr);
        continue;
      }
    }

    await knex('request_master')
      .where({ request_id })
      .update({
        request_status,
        updated_by: currentUser,
        updated_at: currentTimestamp
      });

    res.status(200).json({ message: 'Request accepted and files categorized successfully.' });

  } catch (err) {
    console.error('Error during accept process:', err);
    res.status(500).json({ message: 'Failed to accept request', error: err.message });
  }
});

module.exports = router;