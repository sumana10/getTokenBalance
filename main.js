// main.js

const serverUrl = "";
const appId = "";
Moralis.start({ serverUrl, appId });

/** Add from here down */
async function login() {
  let user = Moralis.User.current();
  if (!user) {
   try {
      user = await Moralis.authenticate({ signingMessage: "Hello World!" })
      console.log(user)
      console.log(user.get('ethAddress'))
      document.getElementById('ethAddress').innerHTML = user.get('ethAddress')
      let address = user.get('ethAddress')
      populate()

    // get BSC native balance for a given address
    const options = { chain:"bsc testnet", address: address };
    const balance = await Moralis.Web3API.account.getNativeBalance(options);
    document.getElementById('balance').innerHTML = balance['balance'] / 10 **18 ;
   

    async function populate(){
      const balances = await Moralis.Web3API.account.getTokenBalances({chain: "bsc testnet"}).then(buildTableBalances);
      console.log(balances)
    }
    
    function buildTableBalances(data){
  
      document.getElementById("resultBalances").innerHTML = `<table class="table table-light table-striped" id="balancesTable">
                                                              </table>`;
      const table = document.getElementById("balancesTable");
      const rowHeader = `<thead>
                              <tr>
                                  <th>Token</th>
                                  <th>Symbol</th>
                                  <th>Balance</th>
                                  <th>Decimals</th>
                              </tr>
                          </thead>`
      table.innerHTML += rowHeader;
      for (let i=0; i < data.length; i++){
        
          let row = `<tr>
                          <td>${data[i].name}</td>
                          <td>${data[i].symbol}</td>
                          <td>${Moralis.Units.FromWei(data[i].balance,data[i].decimals )}</td>
                          <td>${data[i].decimals}</td>
                      </tr>`
          table.innerHTML += row
      }
    }
  

   } catch(error) {
     console.log(error)
   }
  }
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
}



document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;

