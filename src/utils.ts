import ip from 'ip';
import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import type { ApolloServer } from 'apollo-server-express';
import { CompressionTypes, Kafka, logLevel, ProducerRecord } from 'kafkajs';

/** APP_SECRET is used to sign JWT tokens and verifying them later */
export const APP_SECRET = 'CHANGE-ME';
/** Prisma client used to access the data layer */
export const prisma = new PrismaClient({ log: ['query'] });

/**
 * Creates an Express server leveraging 'apollo-server-express'
 * @param server {ApolloServer}
 * @returns {Promise<Express>}
 */
export async function createServer(server: ApolloServer): Promise<Express> {
  const app = express();
  await server.start();
  server.applyMiddleware({ app });
  return app;
}

/**
 * Creates a Kafka client
 * @returns {Kafka}
 */
export function createKafkaClient(): Kafka {
  const host: string = process.env.HOST_IP || ip.address();
  return new Kafka({
    clientId: 'identity-service',
    brokers: [`${host}:9092`], // TODO: migrate to another solution
    logLevel: logLevel.ERROR,
  });
}

const kafka = createKafkaClient();
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'identity-service-group' });

export const pipe = {
  consumer: {
    run: () =>
      consumer.run({
        eachMessage: async (payload) => {
          const obj = JSON.parse(String(payload.message.value));
          if (payload.topic === 'cart-created') {
            await prisma.user.update({
              data: {
                cartId: obj.id,
              },
              where: {
                id: obj.userId,
              },
            });
          }
        },
      }),
    connect: consumer.connect,
    subscribe: consumer.subscribe,
    disconnect: consumer.disconnect,
  },
  producer: {
    send: (record: ProducerRecord) =>
      producer.send({
        ...record,
        topic: record.topic,
        messages: record.messages,
        compression: record.compression || CompressionTypes.GZIP,
      }),
    connect: producer.connect,
    disconnect: producer.disconnect,
  },
};
