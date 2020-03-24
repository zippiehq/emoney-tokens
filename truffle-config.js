const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    zippienet: {
      provider: () =>
        // Change pivatekey to account to deploy from
        new HDWalletProvider(
          '0000000000000000000000000000000000000000000000000000000000000000',
          'https://zippienet-eth.dev.zippie.org/rpc',
          0,
          1
        ),
      network_id: '*' // Match any network id
    }
  },
  compilers: {
    solc: {
      version: '0.4.26'
    }
  }
}
