## Summry
To summarize how this peroject is shaped up, 

we started off by an Index file
 - In index file, we made sure we inclued a series of routes which our front-end will be able to consume once it starts accessing all of these routes via Https endpoints 
 - This routes define inside the routes file 

<-- routes file -->
 
 - in that routes folder we have index.js file where we have define our routes based on important funtionalities by smart contract
 - we had one smart contract related to token, which was our "upgradToken" smart contract and we had another smart contract related to "defiplatform".
 - Both of these functionalites were grouped separately in a separate sets of Http endpoints that were exposed to your front-end
 - And we had some other miscellaneous funstionalities like pinging and getting tha balance of ethers of every account which was supported by utility or Ethereum funstions

 - Each of this endpoints were then triggering the respective funstions defined in the **"API"** Module

 <-- API -->
 
 Job of the API module or this files in the API module was to define all of the functions that would be executed by these Http endpoints.

 Taking those request properties and execute the corrosponding **controllers functions** defined inside the **"controller"** module 

 Later on once the response comes back from controller,the Api module would properly format that response and send it in a nicely formatted manner to the front-end.

 Similarly, if there was an error, it would catch that perticular error and send the response of that error in properly formatted manner for the front-end to show that to the user.

 Both of this **error handling & formatting of success response** were perfomed using "Utility" functions that we defined for formatting a succes and send our error responses.

<-- Controller -->

As part of controller module, we define functions which would handle **taking the input parameters and first validating** whether those parameters are right or wrong.

So that befor they get send to the blockchain network, we can root out or we can weed out the parameters which don't make sense to be sent to the blockchain network.

And finally inside **blockchain connector**  where we performed most fo the grunt work 

<-- Blockchain/Connectors -->

 In that we do work for ether formtting or getting an instance of contract of contract object.

 Once we had an instnace of our contract object , depending on whather this was a call or send transcation, we peromed the various activites including  
  - structuring Tranasaction
  - Signing Transaction
  - Sending the Singed Transaction to the network
  - Or simply call that perticular Transaction from instance of smart contract to get values from the network for the two diff smart contract we had deployed on the blockchain platform

All of this handled via two different connectors that we built on the blockchain platform and the utlity folder handle various other small little helper functions that we need across all of our connectors to be able to reduce the number of lines we are puting inside of our code.

And with this, We hav essentially put together a backend service powerd by Node.js and an HTTP endpoint service exposed via express to power a frontend to consume all of these services and the data to be sent and recevied back from the blockchain network

With this, you have the entire project completely written down and you know exactly what each of the files inside the project is doing.