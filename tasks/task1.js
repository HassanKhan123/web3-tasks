import Web3 from 'web3';
import pkg from 'ethers';
import { default as common } from '@ethereumjs/common';
// import Chains from '@ethereumjs/common';
import EthTransaction from '@ethereumjs/tx';
import axios from 'axios';

const { Transaction } = EthTransaction;
const { ethers } = pkg;

const ETH_NODE_URL =
  'https://speedy-nodes-nyc.moralis.io/fc2bb71e9c6f8cf3d260091d/eth/rinkeby';
const GET_GAS_PRICE = 'https://ethgasstation.info/api/ethgasAPI.json';
// const ETHEREUM_CHAIN_TX = Chain.Rinkeby;
const privateKey =
  '0x44fbef73edf55d883c40df0b4ecec2eb91b2abc45abfc545cc8a71b9a6e9c542';
const address = '0x18dda4DfDE552FAF04f26c960704a2FDBc8d2F6A';
const receiverAddress = '0x4aa0b1851242f641a480F2199f0D86e107DA6160';
const Common = common.default;

const getGasPrice = async () => {
  const { data } = await axios.get(GET_GAS_PRICE);
  return data;
};

const sendTransaction = async () => {
  try {
    let web3 = new Web3(new Web3.providers.HttpProvider(ETH_NODE_URL));
    let senderStartingBalance = await web3.eth.getBalance(address);
    let receiverStartingBalance = await web3.eth.getBalance(receiverAddress);

    console.log(
      'SENDER STARTING BALANCE====',
      ethers.utils.formatUnits(senderStartingBalance)
    );
    console.log(
      'RECEIVER STARTING BALANCE====',
      ethers.utils.formatUnits(receiverStartingBalance)
    );

    let common = new Common({ chain: 'rinkeby' });
    let currentGasPrice = await getGasPrice();
    let gas_price = currentGasPrice.average / 10;
    let pvtKey = Buffer.from(privateKey.split('x')[1], 'hex');
    let transactionObject = {};
    let count = await web3.eth.getTransactionCount(address);
    transactionObject = {
      from: address,
      nonce: '0x' + count.toString(16),
      to: receiverAddress,
      value: web3.utils.toHex(web3.utils.toWei('0.01', 'ether')),
      gasLimit: web3.utils.toHex(21000),
      gasPrice: web3.utils.toHex(
        web3.utils.toWei(gas_price.toString(), 'gwei')
      ),
    };

    const tx = new Transaction(transactionObject, { common });

    const signedTx = tx.sign(pvtKey);

    const serializedTx = signedTx.serialize();
    const raw = '0x' + serializedTx.toString('hex');
    await web3.eth
      .sendSignedTransaction(raw)
      .once('sent', p => {
        console.log('sent', p);
      })
      .once('transactionHash', txHash => {
        console.log('transactionHash', txHash);
      })
      .once('receipt', p => {
        console.log('rec', p);
      })
      .once('confirmation', async conf => {
        console.log('confirmation====', conf);
        let senderCurrentBalance = await web3.eth.getBalance(address);
        let receiverCurrentBalance = await web3.eth.getBalance(receiverAddress);
        console.log(
          'SENDER CURRENT BALANCE====',
          ethers.utils.formatUnits(senderCurrentBalance)
        );
        console.log(
          'RECEIVER CURRENT BALANCE====',
          ethers.utils.formatUnits(receiverCurrentBalance)
        );
      })

      .once('error', err => {
        console.log('err', err);
        throw err;
      });
  } catch (error) {
    console.log('ERR===', error);
  }
};

sendTransaction();
