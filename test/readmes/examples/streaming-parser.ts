import { httpServer, App, start, BodyParser, defaultBodyParsers, describe, csv, ok } from '@ovotech/laminar';
import { pipeline, Readable, Transform } from 'stream';
import * as parse from 'csv-parse';
import * as stringify from 'csv-stringify';

const csvParser: BodyParser = {
  match: (contentType) => contentType === 'text/csv',
  parse: async (body) => body,
};

const upperCaseTransform = new Transform({
  objectMode: true,
  transform: (row: string[], encoding, callback) =>
    callback(
      undefined,
      row.map((item) => item.toUpperCase()),
    ),
});

/**
 * A function that will convert a readable stream of a csv into one with all items upper cased.
 * Using node's [pipeline](https://nodejs.org/api/stream.html#stream_stream_pipeline_streams_callback) function to handle the streams
 */
const transformCsv = (body: Readable): Readable =>
  pipeline(body, parse(), upperCaseTransform, stringify(), (err) => (err ? console.error(err.message) : undefined));

const app: App = ({ body }) => csv(ok({ body: transformCsv(body) }));

const server = httpServer({
  port: 3333,
  app,
  options: { bodyParsers: [csvParser, ...defaultBodyParsers] },
});

start(server).then(() => console.log(describe(server)));
