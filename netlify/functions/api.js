import serverless from 'serverless-http';
import app from '../../server/server.js';
import { connectDB } from '../../server/config/db.js';

const expressHandler = serverless(app, {
  request: (req) => {
    // Requests rewritten from /api/* may arrive under the function path; restore the /api prefix Express expects
    req.url = req.url.replace(/^\/\.netlify\/functions\/api/, '/api');
  },
});

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB().catch((err) => console.error(`[MongoDB] ${err.message}`));
  return expressHandler(event, context);
};
