// @ts-check
// Required imports
const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main () {
  
  //
  // Initialise the provider to connect to the local polkadot node
  //
  const provider = new WsProvider('ws://127.0.0.1:9944');

  // Create the API and wait until ready
  const api = await ApiPromise.create(provider);
  
  // Retrieve active validators
  const [validators] = await Promise.all([
    api.query.session.validators()
  ]);

  if (validators && validators.length > 0) {
    // Map staking stats to validators
    const validatorStaking = await Promise.all(
      validators.map(authorityId => api.derive.staking.info(authorityId))
    );
    validatorStaking.forEach((val) => {
      //console.log(JSON.stringify({ validator: val.accountId, total: formatDot(val.stakers.total) + ' DOT' }));
      var sql = "INSERT INTO bonded (accountId, timestamp, amount) VALUES ('" + val.accountId + "', UNIX_TIMESTAMP(), '" + val.stakers.total + "');";
      console.log(sql);
    });
  }
}

main().catch(console.error).finally(() => process.exit());