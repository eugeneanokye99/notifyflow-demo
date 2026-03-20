const app = require('./src/app');
const { port } = require('./src/config/env');

app.listen(port, () => {
  console.log(`NotifyFlow backend running on port ${port}`);
});
