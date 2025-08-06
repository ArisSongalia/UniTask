import { connectMongo, client } from './mongoClient.js';
import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

connectMongo();

app.get('/api/data', async (req, res) => {
  const collection = client.db("yourDB").collection("yourCollection");
  const data = await collection.find({}).toArray();
  res.json(data);
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));

app.post('/api/data', async (req, res) => {
    try {
        const newItem = req.body;
        const collection = client.db()
    } catch (error){

    }
})
