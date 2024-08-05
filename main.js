import Web3 from "web3";

const wssNode = "";
const address = "";
const privateKey = "";

const web3 = new Web3(wssNode);

const getGasPrice = async (balance) => {
  const gasPrice = balance / 21000n;
  return gasPrice;
};

const sendTransaction = async (balance) => {
  const gasPrice = await getGasPrice(balance);
  const gasLimit = 21000;

  const tx = {
    from: address,
    to: address,
    value: 0,
    gas: gasLimit,
    gasPrice: gasPrice,
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

  return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
};

const checkAndSpendBalance = async () => {
  const balance = await web3.eth.getBalance(address);
  console.log(balance);
  if (balance > 21000n) {
    console.log(
      `Balance detected: ${web3.utils.fromWei(balance, "ether")} ETH. Sending transaction to burn gas...`,
    );
    try {
      const receipt = await sendTransaction(balance);
      console.log("Transaction successful:", receipt);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  } else {
    console.log("No balance detected.");
  }
};

const newBlocksSubscription = await web3.eth.subscribe("newHeads");

newBlocksSubscription.on("data", async (result) => {
  console.log("New block header: ", result.number);
  await checkAndSpendBalance();
});
newBlocksSubscription.on("error", (error) =>
  console.log("Error when subscribing to New block header: ", error),
);

console.log("Script is running. Waiting for new blocks...");
