var exec = require('child_process').execSync;

function reset() {
  exec('docker exec pineapple_db_1 psql -U postgres -f /scripts/reset_qa_database.sql');
}

module.exports = {
  reset: reset
};
