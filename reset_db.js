const db = require('./db');

for (const [name, klass] of Object.entries(db.models)) {
  console.log(name)
  klass.sync({force: true});
}
