import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();


const uri = "mongodb+srv://arissongaliamcpe:Relente%23@uni-task.thupthf.mongodb.net/?retryWrites=true&w=majority&appName=uni-task";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const db = client.db('uni-task');

let isConnected = false;

async function connectMongo() {
  try {
    await client.connect();
    isConnected = true;
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch(error) {
    isConnected = false;
    console.error("Mongo DB Connection error: ", error)
  }
}

function isMongoConnected() {
    return isConnected;
}

async function createCollection({collectionName}) {
    if(!collectionName) {
        console.error('Collection name is required');
        return;
    }

    try {
        await client.connect();
        const db = client.db('uni-task');

        const existingCollections = await db.listCollections({name: collectionName}).toArray();
        if (existingCollections.length > 0) {
            console.error('Collection name already exists');
        };

        await db.createCollection(collectionName);
        console.log('Collection created')
    } catch (error) {
        console.error('Error creating collection: ', error.message)
    }
};

async function uploadRawImage({ filename, filedata, collectionName }){
  const currentCollection = collectionName ?? 'files';
  await createCollection({ collectionName: currentCollection });
  const collection = db.collection(currentCollection);

  if(!fs.existsSync(filedata)) {
    console.error('File data not found', filedata);
    return;
  }

  const imageBuffer = fs.readFileSync(filedata);

  await collection.insertOne({
    filename: filename ?? 'untitled',
    date: new Date(),
    filedata: imageBuffer,
  })
}

export { client, connectMongo, isMongoConnected, createCollection, uploadRawImage }