import jsonServer from "json-server";
import auth from "json-server-auth";

const server = jsonServer.create();
const router = jsonServer.router("src/assets/db.json"); // Tu base de datos
const middlewares = jsonServer.defaults();

server.db = router.db; // Importante para manejar autenticación

server.use(middlewares);
server.use(auth);
server.use(router);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`JSON Server with Auth running on http://localhost:${PORT}`);
});
