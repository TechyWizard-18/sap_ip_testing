const express = require('express');
const sql = require('mssql');
const app = express();

const config = {
    user: 'DashboardUser',
    password: 'Kar@2022',
    server: '122.176.63.102',        
    database: 'VINSAK_FY1920',
    port: 14330,                     
    options: {
        encrypt: false,              
        trustServerCertificate: true 
    }
};

app.get('/', (req, res) => {
    res.send("SAP B1 Dashboard API is running. Try the /api/partners or /api/items endpoints.");
});

// Endpoint 1: Fetch Top 10 Business Partners (Customers/Vendors)
app.get('/api/partners', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        // Querying the standard OCRD table for Business Partners
        const result = await pool.request().query(`
            SELECT TOP 10 
                CardCode AS PartnerID, 
                CardName AS CompanyName, 
                CardType AS Type, 
                Balance 
            FROM OCRD 
            WHERE CardType = 'C' -- 'C' stands for Customer
        `); 
        
        res.json({ 
            success: true, 
            count: result.recordset.length,
            data: result.recordset 
        });
        pool.close();
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Endpoint 2: Fetch Top 10 Inventory Items
app.get('/api/items', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        // Querying the standard OITM table for Items
        const result = await pool.request().query(`
            SELECT TOP 10 
                ItemCode, 
                ItemName, 
                ItmsGrpCod AS ItemGroup 
            FROM OITM
        `); 
        
        res.json({ 
            success: true, 
            count: result.recordset.length,
            data: result.recordset 
        });
        pool.close();
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
