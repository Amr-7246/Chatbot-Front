// ~ ########################## Apollo Server GraphQL API (Insted of Backend Server)
import { ApolloServer, gql } from 'apollo-server-micro';
import type { NextApiRequest, NextApiResponse } from 'next';

const typeDefs = gql`
  type Query {
    askAgent(question: String!): String
  }
`;

const resolvers = {
  Query: {
    askAgent: async (_parent: any, args: { question: string }) => {
      const res = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: args.question }),
      });
      const data = await res.json();
      return data.answer;
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });
const startServer = apolloServer.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await startServer;
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
