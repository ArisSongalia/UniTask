import { connectMongo, client } from './mongoClient.js';
import express from 'express'
import cors from 'cors'
import multer from 'multer';
import fs from 'fs';


const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ dest: 'uploads/' });

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
        const collection = client.db('uni-task').collection('files');
        await collection.insertOne(newItem)
        res.status(201).json({ message: 'Item added succesfully' });
    } catch (error){
      res.status(500).json( {error: error.message })
    }
})

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileBuffer = await fs.promises.readFile(filePath);
    const collection = client.db('uni-task').collection('files');
    const parentId = req.body.parentId;

    await collection.insertOne({
      filename: req.file.originalname,
      date: new Date(),
      filedata: fileBuffer,
      parentId: parentId,
    });

    

    res.status(200).send({ message: 'File uploaded and stored in MongoDB' });
    await fs.promises.unlink(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
