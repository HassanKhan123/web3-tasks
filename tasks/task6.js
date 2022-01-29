import Web3 from "web3";

const ETH_NODE_URL =
  "https://speedy-nodes-nyc.moralis.io/fc2bb71e9c6f8cf3d260091d/eth/mainnet";

let web3 = new Web3(new Web3.providers.HttpProvider(ETH_NODE_URL));

const txnHash =
  "0x6218ca1db18c1e1fff95b158854e85f37adf75de9ba108f338f4d089be417101";

web3.eth.getTransaction(txnHash, function (e, data) {
  if (e !== null) {
    console.log(
      "Could not find a transaction for your id! ID you provided was " + txnHash
    );
  } else {
    console.log(data);

    let input_data = "0x" + data.input.slice(10);
    console.log("input===", input_data);
    let params = web3.eth.abi.decodeParameters(
      ["address", "uint256"],
      input_data
    );
    console.log("%ctask6.js line:21 params", "color: #007acc;", params);
    console.log(
      `Execution worked fine! \n Sender :${data.from} \n Reciever ${params[0]} \n Number of tokens in wei: ${params[1]} `
    );
  }
});
