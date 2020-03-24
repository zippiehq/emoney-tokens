var FiatTokenV1 = artifacts.require("./FiatTokenV1.sol");
var FiatTokenProxy = artifacts.require("./FiatTokenProxy.sol");

// Any address will do, preferably one we generated
var throwawayAddress = "0x3613c4Aa1AD2259774FE7278a961a6b1E7f726F5";

module.exports = function(deployer, network, accounts) {

    if( network == "development" || network == "coverage" || network == "test" ) {
        // Change these to the cold storage addresses provided by ops
        // these are the deterministic addresses from ganache, so the private keys are well known
        // and match the values we use in the tests
        var admin = "0x2f560290fef1b3ada194b6aa9c40aa71f8e95598";
        var masterMinter = "0x3e5e9111ae8eb78fe1cc3bb8915d5d461f3ef9a9";
        var pauser = "0xaca94ef8bd5ffee41947b4585a84bda5a3d3da6e";
        var blacklister = "0xd03ea8624c8c5987235048901fb614fdca89b117";
        var owner = "0xe11ba2b4d45eaed5996cd0823791e0c93114882d";
    }

    if ( network == 'zippienet' ) {
        var admin = "0xd4DD73e376D74c898f2C15AC47500aa9a650Ee91";
        var masterMinter = "0x919A372338C3aA944309B26715eFD1e366BeD7e4";
        var pauser = "0x919A372338C3aA944309B26715eFD1e366BeD7e4";
        var blacklister = "0x919A372338C3aA944309B26715eFD1e366BeD7e4";
        var owner = "0x919A372338C3aA944309B26715eFD1e366BeD7e4";
    }

    console.log("deploying impl")

    var fiatTokenImpl;
    var tokenProxy;
    // deploy implementation contract
    deployer.deploy(FiatTokenV1)
        .then(function(impl) {
            fiatTokenImpl = impl;
            console.log("initializing impl with dummy values")
            return impl.initialize(
                "",
                "",
                "",
                0,
                throwawayAddress,
                throwawayAddress,
                throwawayAddress,
                throwawayAddress
            );
        })
        .then(function(initDone){
            console.log("deploying proxy");
            return deployer.deploy(FiatTokenProxy, fiatTokenImpl.address);
        })
        .then(function(proxy){
            tokenProxy = proxy;
            console.log("reassigning proxy admin");
            // need to change admin first, or the call to initialize won't work
            // since admin can only call methods in the proxy, and not forwarded methods
            return proxy.changeAdmin(admin);
        })
        .then(async function(changeAdminDone){
            console.log("initializing proxy");
            // Pretend that the proxy address is a FiatTokenV1
            // this is fine because the proxy will forward all the calls to the FiatTokenV1 impl
            //console.log(tokenProxy)
            tokenProxy = await FiatTokenV1.at(tokenProxy.address);
            //console.log(tokenProxy)
            return tokenProxy.initialize(
                "JAMBOPAY-KSH",
                "JAMBOPAY-KSH",
                "KSH",
                6,
                masterMinter,
                pauser,
                blacklister,
                owner
            );
        })
        .then(function(initDone) {
            console.log("Deployer proxy at ", tokenProxy.address);
        });
};