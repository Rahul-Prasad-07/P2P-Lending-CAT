In Index.js
  - list down all the various npm modules for this project 
  - create HTTP server & start server at specific port number(define at config file)
    in config file : for development - starting server at : 5001 --> we will serving our backend service or backend api from this port
  - exposing certain routes, which would be consumed by frontend to various functionality that written in backend infra

   In routes file

    Routes = In routes file --> index.js file : keeping tracks of all routes that we have inclueded in our project

    our backend app split all functionalites that our smart contract provide into 3 seperate section 
      1.Ethereum
        - functionalities : Get eth balances
        - version : v1
        - path : v1/ethereum/balance

      2.Token smart contract
        - functionalities : balance, allownace, transfer, approve
        - version : v1
        - get :  balance, allownace
        - post : transfer, approve
        - path : v1/upgradToken/(balance, allownace, transfer, approve)

      3.DeFi Platform smart contract
        - functionalities : ask, lend, payback, collect, cancel, askBatch, request
        - version : v1
        - get :  request
        - post : ask, lend, payback, collect, cancel, askBatch
        - path : v1/defiPlatform/(ask, lend, payback, collect, cancel, askBatch, request)

    API folder
    
    now, the way this porject is structure is all of the APIs will excecute first a function define in the API folder
      1.ethereum.js 
        - have the function that trigger on excecuting an API that is from ethereum group in upper part

      2.upgradToken.js
        - have the function that when frontend trigger on excecuting an API that is from Token group in upper part 
    
In API folder

      1.misc.js
        - function : ping
        - functionalities : to allow ourself to get a state of our backend service, 
          - when frontend need to check our backend up and running or not simply hit ping & it make sure it is going to respond back & letting frontend know that i'm accepting request and i could respond back at your request.
          this is helper function.

      2.ethereum.js 
        - function : balance
        - functionalities : to getting balance of an ethereum account. 
           - inside of this api file , What we have done is simply handled the input parameter that user passes via these api requests 
           - this input parameters after being handled and then passed on to further functions which have been defined inside the *controller* files
           - controller files : seperate node js modules, which are taking in input parameters once captured by API functions, converted to the right format or cleaned out befor they are then futhur send out to the second level function which are inclued in ethereum controller file.
            - in controller 
              - defiPlatform.js
              - ethereum.js
              - upgradtoken.js

              this tree controller funstions is where most of our excecution of logic is going to happend on the backend.
              
      3.upgradToken.js 
        - function : balance (async function)
        - functionalities : this is all async function bcz these  are all functions that are going to get or deal furthur down the line
                            with it ethereum responses. and bcz eth responses in promises which are going to resolve in term of a value that eth network sends back.
                            we need all of our functions right from function that intercats with eth network to all the functions which are then intercating with that balance or other functions to continue be async.
                            so we can continue to pass all of the functions that are inherently calling that functions from top file.

                            - balance ( req, res)

                          
          
              