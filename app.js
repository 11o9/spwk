const express = require('express');
const sql = require('mssql');

const DB_HOST = 'spwk-vm.koreacentral.cloudapp.azure.com';
const DB_NAME = 'mssql_RoK_GIS_05302017';
const DB_USERNAME = 'spwk_dvlp';
const DB_PASSWORD = 'building39!';

(async () => {
  try {
    const pool = await sql.connect(`mssql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`);
    
    const app = express();
    
    app.get('/', (req, res) => {
      res.send({ message: 'Hello!' });
    });
    
    app.get('/landuse/:stateID', async (req, res) => {
      const { stateID } = req.params;
      const { searchString } = req.query;
    
      if (!searchString) {
        return res.status(400).send({
          message: 'missing parameter : searchString',
        });
      }
    
      try {
        const result = await pool.request()
          .query(`
            SELECT * FROM ${stateID}_landuse WHERE
            LegalTownName LIKE N'${searchString}%'
          `)
    
        res.send(result);
      } catch (err) {
        console.error(err);
    
        res.status(500).send({ 
          error: 'Something wrong :(',
        });
      }
    });
    
    app.listen(4000, () => {
      console.log('Listening at localhost:4000');
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
