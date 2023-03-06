
// we have configuration for blockchain url and parameter along with port and ip address 
// is what we are passing into web3 instance to initiate a new instance.

// property of this instance 127.0.0.1--> represnt localhost 8545--> this is where your ganache instance avaiable
// which we've started and deployed a smart contract on . Ganache's RPC server is exposed at 127.0.01:8545 & we are providing that same instance as web3 provider to our module.
// bcz of that that web3 instance connected with ganache & have access to the deployed smart contracts 

// note --> u cloud changed the HTTP provider to any other blockchain node that you wanted to connected to depending on which blockchain platfor u want to connect.
//  wheather its local node , Geath node , or ganache instance or ropstane network or mainnet network.

// To give u sense of that : we have change our blokchain url from ganache to an IP ADDRESS given by ROPSTAN network or mainnet network which is exposed by infura api services .