import Server from "./server";
import { makeDbConnection, createEmailQueueConnection } from "./master";

let app;

async function startServer(): Promise<void> {
    try {
      const newServer = new Server();
      app = newServer.app.listen(newServer.port, () => {
        console.log(`Server is listening on ${newServer.port}`);
      });
    } catch (error) {
      console.log(`This process failed to start`);
    }
  }

  makeDbConnection()
  .then(response => {
    if (response) {
      return createEmailQueueConnection();
    }
  })
  .then(response => {
    if (response) {
      return startServer();
    }
  })
  .catch(error => {
    process.exit();
  });

export default app;
