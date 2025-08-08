import express from 'express'
import cors from 'cors'
import multer from 'multer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

if (!process.env.MONGODB_URI) {
  throw new Error('Missing MONGODB_URI in environment');
}

await mongoose.connect(process.env.MONGODB_URI, { dbName: 'uni-task' });


const itemSchema = new mongoose.Schema({}, {
  strict: false,
  timestamps: true,
});

const Item = mongoose.model('Item', itemSchema);

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String },
  date: { type: Date, default: Date.now },
  filedata: { type: Buffer, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
})

const File = mongoose.model('File', fileSchema);


app.get('/api/data', async (req, res) => {
  try {
    const data = await Item.find({}).lean();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});

app.post('/api/data', async (req, res) => {
  try{
    const doc = await Item.create(req.body);
    res.status(201).json({ message: 'Item added succesfully', id: doc._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try{
    if(!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    await File.create({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      date: new Date(),
      filedata: req.file.buffer,
      parentId: req.body.parentId,
    })

    res.status(200).json({ message: 'File uploaded succesfully'});

  } catch (error){
    res.status(500).json({ error: error.message });
  }
})

app.listen(5000, () => console.log('Server running on port 5000'))
