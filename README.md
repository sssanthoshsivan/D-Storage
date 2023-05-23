<div id="top"></div>

<!-- ABOUT THE PROJECT -->
## IPFS storage Dapp
Blockchain-based decentralized storage using IPFS is a novel approach to data storage that
leverages blockchain technology and the InterPlanetary File System (IPFS) to provide a secure,
decentralized, and scalable solution, In this system, data is stored on the IPFS network and is protected by the immutability and security
features of the blockchain network, The decentralized nature of the IPFS network ensures that data is distributed across multiple nodes,
providing redundancy and reducing the risk of data loss, Furthermore, since the data is encrypted, only authorized users with the IPFS hash can access it,
providing an additional layer of security

## Table of Contents
**1. Softwares Used**
**2. Prerequisties**
**3. Installation**
**4. System Architecture**
**5. How to run**
**6. Preview**
**7. Resources**
**8. Credits**

### Software Used

* [Solidity](https://docs.soliditylang.org/)
* [Brownie](https://eth-brownie.readthedocs.io)
* [React.js](https://reactjs.org/)
* [ethers.js](https://docs.ethers.io/v5/)
* [web3modal](https://github.com/Web3Modal/web3modal)
* [material ui](https://mui.com/getting-started/installation/)


<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#contracts">Contracts</a></li>
        <li><a href="#scripts">Scripts</a></li>
        <li><a href="#testing">Testing</a></li>
        <li><a href="#front-end">Front End</a></li>
      </ul>
    </li>
    <li><a href="#resources">Resources</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>



### Prerequisites

Please install or have installed the following:
* [nodejs and npm](https://nodejs.org/en/download/) 
* [python](https://www.python.org/downloads/)
* [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) Chrome extension installed in your browser

### Installation

1. Installing Brownie: Brownie is a python framework for smart contracts development,testing and deployments. It's quit like [HardHat](https://hardhat.org) but it uses python for writing test and deployements scripts instead of javascript.
   Here is a simple way to install brownie.
   ```
    pip install --user pipx
    pipx ensurepath
    # restart your terminal
    pipx install eth-brownie
   ```
   Or if you can't get pipx to work, via pip (it's recommended to use pipx)
    ```
    pip install eth-brownie
    ```
   Install [ganache-cli](https://www.npmjs.com/package/ganache-cli): 
   ```sh
    npm install -g ganache-cli
    ```
   
3. Clone the repo:
   ```sh
   git clone https://github.com/kaymen99/ipfs-storage-dapp.git
   cd ipfs-storage-dapp
   ```
3. Install Ganache:
   Ganache is a local blockchain that run on your machine, it's used during development stages because it allows quick smart contract testing and avoids all real         Testnets problems. 
   You can install ganache from this link : https://trufflesuite.com/ganache/
   
   Next, you need to setup the ganache network with brownie :
   ```sh
   cd ipfs-storage-dapp
   brownie networks add Ethereum ganache-local host=http://127.0.0.1:7545 chainid=5777
   ```
4. Set your environment variables
   To be able to deploy to real Polygon testnets you need to add your PRIVATE_KEY (You can find your PRIVATE_KEY from your ethereum wallet like metamask) to the .env file:
   ```
   PRIVATE_KEY=<PRIVATE_KEY>
   ```
   In this project i used the Polygon Testnet but you can choose to use ethereum testnets like rinkeby, Kovan.
   
   To setup the Polygon Testnet with brownie you'll need an Alchemy account (it's free) and just create a new app on the polygon network
   
   
   After creating the app copy the URL from -view key- and run this: 
   ```sh
   cd ipfs-storage-dapp
   brownie networks add Polygon polygon-mumbai host=<Copied URL> chainid=80001 name="Mumbai Testnet (Alchemy)"
   ```
   
   You'll also need testnet MATIC. You can get MATIC into your wallet by using the Polygon testnet faucets located [here](https://faucet.polygon.technology). 
   
5. As infura recently removed its free IPFS gateway i used `web3.storage` api for files into IPFS, this api is as simple as infura it requires the creation of a free account and a new api token which you can do [here](https://web3.storage), when you finish add your api token into the `src/utils/StoreContent.js` file:
   ```js
    const web3storage_key = "YOUR-WEB3.STORAGE-API-TOKEN";
   ```
   


<p align="right">(<a href="#top">back to top</a>)</p>

## System Architecture

![Screenshot 2023-05-23 130451](https://github.com/sssanthoshsivan/D-Storage/assets/113821103/a6ea6dcd-b74f-423d-854f-b914a5c63f34)

<!-- USAGE EXAMPLES -->
## How to Run

### Contracts

   In the ipfs-storage-dapp folder you'll find a directory contracts, all the smart contracts build in brownie are stored there. The FileStorage contract is the core of this application, it plays the role of the backend and has the following features:

  <ul>
    <li><b>SetUploadFee:</b> for every file uploaded the user must pay a small fee set by the owner of the contract</li>
    <li><b>Upload:</b> allows the user to upload his file </li>
    <li><b>getUserFiles:</b> a function for getting all the files uploaded by a given user </li>
    <li><b>Chainlink Price Feed:</b> the contract uses the price feed provided by chainlink oracle for converting the fee set by the owner from $ to MATIC    </li>   
  </ul>

<p align="right">(<a href="#top">back to top</a>)</p>
    
### Scripts

   In the ipfs-storage-dapp folder you'll find a directory scripts, it contain all the python code for deploying your contracts and also some useful functions

   The reset.py file is used to remove all previous contracts deployments from build directory:
   ```sh
   brownie run scripts/reset.py
   ```
   The deploy.py file allow the deployment to the blockchain, we'll use the local ganache for now:
   ```sh
   brownie run scripts/deploy.py --network=ganache-local
   ```
   The update_front_end.py is used to transfer all the smart contracts data (abi,...) and addresses to the front end in the artifacts directory:
   ```sh
   brownie run scripts/update_front_end.py
   ```
   
   After running this 3 cammands, the FileStorage contract is now deployed and is integrated with the front end
   
 <p align="right">(<a href="#top">back to top</a>)</p>
  
 ### Testing

   In your ipfs-storage-dapp folder you'll find a directory tests, it contain all the python code used for testing the smart contract functionalities
   
   You can run all the tests by :
   ```sh
   brownie test
   ```
   Or you can test each function individualy:
   ```sh
   brownie test -k <function name>
   ```
   
<p align="right">(<a href="#top">back to top</a>)</p>
   
### Front-end
   
   The user interface of this application is build using React JS, it can be started by running: 
   ```sh
   cd front-end
   yarn
   yarn start
   ```
   It uses the following libraries:
      <ul>
        <li><b>Ethers.js:</b> for conecting to Metamask and interacting with smart contract</li>
        <li><b>ipfs-http-client:</b> for connecting  and uploading files to IPFS </li>
        <li><b>@reduxjs/toolkit:</b> for managing the app states (account, balance, blockchain) </li>
        <li><b>Material UI:</b> used for react components and styles </li>    
      </ul>
      
   The files are structured as follows:
    <ul>
      <li><b>Components:</b> Contains all the app component(main, navbar, filestorage,...) </li>
      <li><b>features:</b> contains the redux toolkit reducer and actions </li>
      <li><b>artifacts:</b> contains all the smart contract data and addresses transfered earlier </li>
      <li><b>NetworksMap:</b> a json file for some known blockchains names & chain id </li> 
    </ul>
    
## Modules
### Client-side components:
    *Web3-enabled browser - MetaMask
    *Front-end user interface (UI) with React
    *IPFS client libraries
### Server-side components:
    *Node.js server
    *IPFS node
    *Smart contract on Polygon Testnet
### Third-party services:
     *Ethereum blockchain
     *IPFS network - Web3 Storage

   
<p align="right">(<a href="#top">back to top</a>)</p>

## Preview
1.Home Page

![Screenshot 2023-05-11 144139](https://github.com/sssanthoshsivan/D-Storage/assets/113821103/b167cb80-d550-4e94-ad8b-6ab6c60ee89b)

2. After Connecting to the MetaMask Wallet

![Screenshot 2023-05-11 144058](https://github.com/sssanthoshsivan/D-Storage/assets/113821103/7aa72d2b-83dc-4dc4-a06e-a89e9bf557f4)

3.Account or Wallet Details

![Screenshot 2023-05-11 144125](https://github.com/sssanthoshsivan/D-Storage/assets/113821103/4b0cc6f6-3c4c-40bc-8a8f-239350d0523f)

4. File is Selected for Upload

![Screenshot 2023-05-11 144237](https://github.com/sssanthoshsivan/D-Storage/assets/113821103/21420a28-fd67-4b1a-8588-01597b6cf097)

5. Transaction Initiated

![Screenshot 2023-05-11 144256](https://github.com/sssanthoshsivan/D-Storage/assets/113821103/27e2f52f-231b-4f60-8dd3-3efbdf74f712)

6. Transaction Confirmed, File is Uploaded Successfully

![Screenshot 2023-05-11 144308](https://github.com/sssanthoshsivan/D-Storage/assets/113821103/25d9f5ff-fc2c-4b7a-ab1b-cb7a8f708469)

## Resources

To learn about Web3, React, Smart Contract and Brownie:

  * [Web3 FAQ by Fireship.io](https://www.youtube.com/watch?v=wHTcrmhskto&t=2s&pp=ygUTZmlyZXNoaXAgYmxvY2tjaGFpbg%3D%3D)
  * [Netninja React Course](https://www.youtube.com/watch?v=j942wKiXFu8&list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d)
  * [Patrick Collins FreeCodeCamp Complete Course](https://youtu.be/M576WGiDBdQ)
  * ["Getting Started with Brownie"](https://iamdefinitelyahuman.medium.com/getting-started-with-brownie-part-1-9b2181f4cb99)

<p align="right">(<a href="#top">back to top</a>)</p>

## Credits
I'm Santhosh Sivan, this project during my computer science degree and i hope you may find it useful, Thank You !



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>






