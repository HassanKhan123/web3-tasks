import Web3 from 'web3';

import abi from '../abi.json';

const ETH_NODE_URL =
  'https://speedy-nodes-nyc.moralis.io/fc2bb71e9c6f8cf3d260091d/eth/rinkeby';
let web3 = new Web3(new Web3.providers.HttpProvider(ETH_NODE_URL));

const contractAddress = '0x01be23585060835e02b77ef475b0cc51aa1e0709';

const contract = new web3.eth.Contract(abi, contractAddress);
contract.getPastEvents(
  'AllEvents',
  {
    fromBlock: 9954992,
    toBlock: 'latest',
  },
  (err, events) => {
    let filtered = events.filter(
      ev => ev.address === '0x01BE23585060835E02B77ef475b0Cc51aA1e0709'
    );
    console.log(filtered);
  }
);
