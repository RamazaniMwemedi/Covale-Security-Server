const app = require("./app"); // the actual Express application
const { createServer } = require("http");
const { PORT } = require("./utils/config");

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
