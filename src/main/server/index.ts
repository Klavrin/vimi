import express from 'express';
import { IncomingMessage, Server, ServerResponse } from 'http';

const app = express();
const PORT = 2005;

let server: Server<typeof IncomingMessage, typeof ServerResponse>;

/**
 * Initiates an express server.
 * @param {string} initFilePath
 */
export const startServer = (initFilePath: string) => {
  app.use('/scripts', express.static(initFilePath));

  server = app.listen(PORT, () => {
    console.log('Listening to port ' + PORT);
  });
};

/**
 * Kills the express server.
 */
export const killServer = () => {
  server.close();
};
