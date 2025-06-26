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

    router.post('/register', async function (req, res, next){
  
  const currentTimestamp = new Date(); //Current time - YYYY/MM/DD - 00/HH/MM/SSS

    console.log(req)
      const {
        emp_firstname,
        emp_lastname,
        user_name,
        emp_position,
        pass_word,
        emp_role
      } = req.body;

      

    try{
        await knex('users_master'). insert({
          emp_firstname: emp_firstname,
          emp_lastname: emp_lastname,
          user_name: user_name,
          emp_position: emp_position,
          pass_word:pass_word,
          emp_role: emp_role,
          created_by: '',
          created_at: currentTimestamp,
          updated_by: '',
          updated_at: currentTimestamp, 
          is_active: 1
          
        });
      console.log('User registered');

    }catch(err){
          console.error("Registration error:", err); // show actual error
      res.status(500).json({ error: "Registration failed", details: err.message });
      }
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
        comrelofficer:{
          type:DataTypes.STRING,
        },
        comrelthree:{
          type:DataTypes.STRING,
        },
        comreldh:{
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
        comrelofficer: 0,
        comrelthree: 0,
        comreldh: 0,
        created_by,
        created_at: currentTimestamp,
        updated_by: '',
        updated_at: currentTimestamp
      })
      .returning('request_id');

    const request_id = newRequest.request_id || newRequest; // for MSSQL compatibility

    let uploadIdToSave = [];

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
          .returning('upload_id');

        const upload_id = upload.upload_id || upload;
          uploadIdToSave.push(upload_id);
      }

      // 2. Update the request_master with file list + upload_id of first file
      await knex('request_master')
        .where({ request_id })
        .update({
          comm_Docs: docFilename.join(','),
          upload_id: uploadIdToSave.join(','),
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

    if (!request_id || !created_by) {
      return res.status(400).json({ error: "Missing request_id or created_by" });
    }

    const updatedByValue = Array.isArray(created_by) ? created_by[0] : String(created_by || 'Unknown');
    const currentTimestamp = new Date();

    const docFilenames = req.files?.map(file => file.filename) || [];

    // If new files were uploaded, delete existing ones for this request_id
    if (docFilenames.length > 0) {
      const existingUploads = await knex('upload_master').where({ request_id });

      // Delete physical files
      for (const upload of existingUploads) {
        if (fs.existsSync(upload.file_path)) {
          fs.unlinkSync(upload.file_path);
        }
      }

      // Delete upload_master records
      await knex('upload_master').where({ request_id }).del();

      // Insert new files into upload_master
      let uploadIdToSave = [];

      const updated_by = Array.isArray(req.body.created_by) ? req.body.created_by[0] : req.body.created_by;


      for (let file of req.files) {
        const { mimetype, originalname, filename } = file;
        const filePath = path.join(DIR, filename);

        const [upload] = await knex('upload_master')
          .insert({
            request_id,
            upload_type: mimetype,
            file_path: filePath,
            file_name: originalname,
            upload_date: currentTimestamp,
            upload_by: updated_by,
            updated_by,
            updated_at: currentTimestamp,
          })
          .returning('upload_id');

        const upload_id = upload.upload_id || upload;
        uploadIdToSave.push(upload_id);
      }

      

      if(position === 'encoder'){

      }
      // Update request_master with new doc info and upload_id
      await knex('request_master')
        .where({ request_id })
        .update({
          request_status: request_status,
          comm_Area,
          comm_Act,
          date_Time,
          comm_Venue,
          comm_Guest,
          comm_Docs: docFilenames.join(','),
          upload_id: uploadIdToSave.join(','),
          comm_Emps,
          comm_Benef,
          updated_by: updatedByValue,
          updated_at: currentTimestamp,
        });
    } else {
      // No files uploaded, update only other fields
      await knex('request_master')
        .where({ request_id })
        .update({
          request_status: request_status,
          comm_Area,
          comm_Act,
          date_Time,
          comm_Venue,
          comm_Guest,
          comm_Emps,
          comm_Benef,
          updated_by: updatedByValue,
          updated_at: currentTimestamp,
        });
    }

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
    console.log(request_id);


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

    console.log('Received comment data:', { comment, created_by, request_id });

    // Insert the comment (SQL Server returns inserted ID as an array)
    const [comment_id] = await knex('comment_master')
      .insert({
        comment,
        created_by,
        created_at,
        request_id
      }).returning('comment_id');

    console.log('Inserted comment ID:', comment_id);

    // Update the request_master with the new comment ID
    await knex('request_master')
      .where({ request_id })
      .update({
        comment_id,
        updated_by: created_by,
        updated_at: created_at
      });

    res.status(200).json({ message: 'Comment added successfully' });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({
      message: 'Failed to add comment',
      error: err.message,
      stack: err.stack // Optional: helps during development
    });
  }
});


router.post('/comment-decline', async function (req, res, next) {
  const currentTimestamp = new Date();
  const {
    request_status,
    emp_position,
    request_id,
    currentUser
  } = req.body;

  try {
    
      if (emp_position === 'comrelofficer'){
      await knex('request_master')
      .where({ request_id})
      .update({
        request_status: 'reviewed',
        updated_by: currentUser,
        updated_at: currentTimestamp,
        comrelofficer: 0,
        comrelthree: 0,
        comreldh: 0
      });
    }
    else if (emp_position === 'comrelthree'){
      await knex('request_master')
      .where({ request_id})
      .update({
        request_status: 'reviewed',
        updated_by: currentUser,
        updated_at: currentTimestamp,
        comrelofficer: 0,
        comrelthree: 0,
        comreldh: 0
      });
    }
    else if (emp_position === 'comreldh'){
      await knex('request_master')
      .where({ request_id})
      .update({
        request_status: 'reviewed',
        updated_by: currentUser,
        updated_at: currentTimestamp,
        comrelofficer: 0,
        comrelthree: 0,
        comreldh: 0
      });
    }

    res.status(200).json({ message: 'Request status updated successfully' });
  } catch (err) {
    console.error('Error updating request status:', err);
    res.status(500).json({ message: 'Failed to update request status' });
  }
});

router.post('/accept', async (req, res, next) => {
  const currentTimestamp = new Date();
  const { request_id, currentUser, emp_position } = req.body;

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

    if (emp_position === 'comrelofficer'){
      await knex('request_master')
      .where({ request_id })
      .update({
        request_status: 'Pending review for ComrelIII',
        updated_by: currentUser,
        updated_at: currentTimestamp,
        comrelofficer: 1
      });
    }
    else if (emp_position === 'comrelthree'){
      await knex('request_master')
      .where({ request_id })
      .update({
        request_status: 'Pending review for Comrel DH',
        updated_by: currentUser,
        updated_at: currentTimestamp,
        comrelthree:1
      });
    }
    else if (emp_position === 'comreldh'){
      await knex('request_master')
      .where({ request_id })
      .update({
        request_status: 'accepted',
        updated_by: currentUser,
        updated_at: currentTimestamp,
        comreldh: 1
      });
    }

    // await knex('request_master')
    //   .where({ request_id })
    //   .update({
    //     request_status,
    //     updated_by: currentUser,
    //     updated_at: currentTimestamp
        
    //   });

    res.status(200).json({ message: 'Request accepted and files categorized successfully.' });

  } catch (err) {
    console.error('Error during accept process:', err);
    res.status(500).json({ message: 'Failed to accept request', error: err.message });
  }
});



module.exports = router;