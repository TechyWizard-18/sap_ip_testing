const express = require('express');
const sql = require('mssql');
const app = express();

const config = {
    user: 'DashboardUser',
    password: 'Kar@2022',
    server: '122.176.63.102',        // Your office PUBLIC IP
    database: 'VINSAK_FY1920',
    port: 14330,                     // Your SAP port
    options: {
        encrypt: false,              
        trustServerCertificate: true 
    }
};

app.get('/', (req, res) => {
    res.send("Backend is running. Go to /test-sap to check the database connection.");
});

app.get('/test-sap', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        // A simple query just to prove the database responds
        const result = await pool.request().query('SELECT @@VERSION as SQLVersion'); 
        res.json({ 
            success: true, 
            message: "Successfully fetched data from SAP Database via Render!",
            data: result.recordset 
        });
        pool.close();
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Render provides the PORT dynamically, so we use process.env.PORT
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
