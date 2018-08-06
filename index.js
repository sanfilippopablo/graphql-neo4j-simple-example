const { ApolloServer, gql } = require("apollo-server-hapi");
const Hapi = require("hapi");

const typeDefs = gql`
  type Author {
    name: String
  }

  type Book {
    title: String
    author: Author
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: async (parent, args, context, resolveInfo) => {
      const result = await context.db.run("MATCH (b:Book) RETURN b");
      return result.records.map(record => {
        record.get("b").properties;
      });
    }
  },
  Book: {
    author: async (parent, args, context) => {
      const result = await context.db.run(
        "MATCH (b:Book {title: {title}}) -[:WRITEN_BY]->(a:Author) RETURN a",
        parent
      );
      return result.records[0].get("a").properties;
    }
  }
};

const neo4j = require("neo4j-driver").v1;

async function StartServer() {
  const driver = neo4j.driver(
    "bolt://db:7687",
    neo4j.auth.basic("neo4j", "asdasdasd")
  );
  const session = driver.session();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ db: session })
  });

  const app = new Hapi.server({
    port: 8000
  });

  await server.applyMiddleware({
    app
  });

  await server.installSubscriptionHandlers(app.listener);

  await app.start();
}

StartServer().catch(error => console.log(error));
