const AWS = require('aws-sdk');
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.DB_CONNECTION_STRING);

exports.handler = async (event) => {
  const { keyword, page = 1, limit = 12 } = event.queryStringParameters || {};

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.COLLECTION_NAME);

    const query = {};
    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }

    const totalResults = await collection.countDocuments(query);
    const skip = (page - 1) * limit;
    const cursor = collection.find(query).skip(skip).limit(limit);
    const results = await cursor.toArray();

    await client.close();

    const response = {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        results,
        totalResults,
        totalPages: Math.ceil(totalResults / limit),
        currentPage: page,
      }),
    };
    return response;

  } finally {
    await client.close();
  }
  
}
