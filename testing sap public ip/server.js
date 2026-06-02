const express = require('express');
const sql = require('mssql');
const app = express();

const config = {
    user: 'Servicebot',
    password: 'Viren@2026',
    server: '122.176.63.102',        
    database: 'VINSAK_FY1920',
    port: 14330,                 
    options: {
        encrypt: false,              
        trustServerCertificate: true 
    }
};

app.get('/', (req, res) => {
    res.send("Hello. SAP B1 Dashboard API is running. Try /api/partners, /api/items, or the new /api/test-write endpoint.");
});

// Endpoint 1: Fetch Top 10 Business Partners
app.get('/api/partners', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT TOP 10 
                CardCode AS PartnerID, 
                CardName AS CompanyName, 
                CardType AS Type, 
                Balance 
            FROM OCRD 
            WHERE CardType = 'C'
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

// SAFE NEW ENDPOINT: Verifies "Write" operation on an isolated custom table
app.get('/api/test-write', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        
        // This will insert a row to prove "db_datawriter" works perfectly 
        const result = await pool.request().query(`
            INSERT INTO Z_API_TEST_LOG (LogMessage, CreatedBy)
            VALUES ('Servicebot database write permission verified successfully!', 'NodeJS_API');
            
            -- Immediately pull back what we just wrote to verify it
            SELECT TOP 5 * FROM Z_API_TEST_LOG ORDER BY LogID DESC;
        `);

        res.json({
            success: true,
            message: "Write operation successful! Data added safely to your test log table.",
            latestLogs: result.recordset
        });
        
        pool.close();
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Write operation failed. Check your user permissions.", 
            error: err.message 
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
