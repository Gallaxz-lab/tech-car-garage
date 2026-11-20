const express = require('express');
const pool = require('./db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/cars', async (req, res) => {
    try {
        const { registration_number, brand, model, year, odometer, notes } = req.body;

        const query = `
        INSERT INTO cars (registration_number, brand, model, year, odometer, notes) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `;

        const values = [
        registration_number,
        brand,
        model,
        year,
        odometer,
        notes || null,
        ];
        
        const result = await pool.query(query, values);
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error inserting car:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/cars', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(page, 10) || 1);
        const limit = 6;
        const offset = (page - 1) * limit;

        const result = await pool.query('SELECT * FROM cars ORDER BY id ASC LIMIT $1 OFFSET $2',[limit, offset]);
        res.status(200).json({
        cars: result.rows,page,
    });
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/cars/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { registration_number, brand, model, year, odometer, notes } = req.body;

        const existingResult = await pool.query('SELECT * FROM cars WHERE id = $1', [id]);

        const existingCar = existingResult.rows[0];

        if (!existingCar) {
            return res.status(404).json({ error: 'Car not found' });
        }

        const updatedCar = {
            registration_number: registration_number || existingCar.registration_number,
            brand: brand || existingCar.brand,
            model: model || existingCar.model,
            year: year || existingCar.year,
            odometer: odometer || existingCar.odometer,
            notes: notes || existingCar.notes
        };

        const query = `
            UPDATE cars 
            SET registration_number = $1, brand = $2, model = $3, year = $4, odometer = $5, notes = $6
            WHERE id = $7
            RETURNING *;
        `;

        const values = [
            updatedCar.registration_number,
            updatedCar.brand,
            updatedCar.model,
            updatedCar.year,
            updatedCar.odometer,
            updatedCar.notes,
            id
        ];

        const result = await pool.query(query, values);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/cars/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM cars WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }

        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
