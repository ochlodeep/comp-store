const fs = require('fs');
const { MongoClient } = require('mongodb');

const jsonString = fs.readFileSync('./take-home-data-facet.json', 'utf8');
const data = JSON.parse(jsonString);
const client = new MongoClient('mongodb://localhost:27017');

exports.handler = async (event) => {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.COLLECTION_NAME);

    dataWithIds = data.map(x => ({
      _id: Buffer.from(JSON.stringify(x.title)).toString('base64'),
      ...x
    }));
    const result = await collection.insertMany(dataWithIds);
    const response = {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        result,
      }),
    };
    return response;

  } finally {
    await client.close();
  }
  
}
