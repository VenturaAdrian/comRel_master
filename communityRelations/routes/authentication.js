var express = require('express');
var bcrypt = require('bcrypt');
const router = express.Router();
var Sequelize = require('sequelize');

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

    const Users = db.define('users_master',{
      id_master:{
        type:DataTypes.INTEGER,
        primaryKey: true
      },
      user_name:{
        type: DataTypes.STRING
      },
      emp_position:{
        type: DataTypes.STRING
      },
      emp_firstname: {
        type: DataTypes.STRING
      },
      emp_lastname: {
        type: DataTypes.STRING
      },
      emp_role:{
        type: DataTypes.STRING
      },
      pass_word: {
        type: DataTypes.STRING
      }
    },{
      freezeTableName: false,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      tableName: 'users_master'
    })

  router.get('/login', async function (req, res, next) {
    try {
        const user = await Users.findAll({
          where: {
          user_name: req.query.user_name
          }
        });

        if (!user || user.length === 0) {
          return res.status(404).json({ msg: 'User not found' });
        }
      
        const match = await bcrypt.compare(req.query.password, user[0].pass_word)

        if(!match){
          console.log('Invalid Password')
        }

        console.log("The username: ", user[0].user_name);
        console.log("Position", user[0].emp_position);
        console.log("First Name: ", user[0].emp_firstname);
        console.log("Last Name: ", user[0].emp_lastname);
        console.log("Role: ", user[0].emp_role);
        console.log("The PWD: ",user[0].pass_word);


        const result = {
          user_name: user[0].user_name,
          emp_position: user[0].emp_position,
          first_name: user[0].emp_firstname,
          last_name: user[0].emp_lastname,
          role: user[0].emp_role,
        };

        res.json(result);
    } catch (err) {
        console.error("Error during login GET:", err);
        res.status(500).json({ msg: 'Server error' });
      }
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
      console.log('PASSWORD:',pass_word)
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

  router.get('/users', async function (req, res, next) {
      // view all users
      const result = await knex.select('*').from('users_master');
      res.json(result);
      console.log(result)

      //add user
      // const reg = knex('users_master').insert({
      //   PersonID:6,
      //   FirstName: 'Vii',
      //   LastName: 'Digi'
      // })
      // .then(() => {
      //   console.log('saved');
      // })

      //delete user
      // const del = knex('users_master').where('PersonID',6).del().then(() => {
      //   console.log('deleted a user');
      // })

      //EDIT user
      // const edit = knex('users_master')
      //                   .where('PersonID',1)
      //                   .update({
      //                     PersonID: 69,
      //                     FirstName: 'Lala',
      //                     LastName: 'Land'
      //                   })
      // .then(() => {
      //   console.log('Updated user');
      // })




  })


  module.exports = router;