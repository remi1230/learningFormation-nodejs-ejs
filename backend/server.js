const http = require('http');
const app = require('./app');
const sequelize = require('./config/database');

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.on('error', (error) => {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
  if (error.code === 'EACCES') { console.error(bind + ' requires elevated privileges.'); process.exit(1); }
  if (error.code === 'EADDRINUSE') { console.error(bind + ' is already in use.'); process.exit(1); }
  throw error;
});

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
});

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log('DB ready.');
    server.listen(port, '0.0.0.0', () => {
      console.log(`API listening on :${port}`);
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
})();
