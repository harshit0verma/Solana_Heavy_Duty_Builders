import { createMint, getMint,getOrCreateAssociatedTokenAccount,getAccount,mintTo } from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const payer = Keypair.generate();
const mintAuthority = Keypair.generate();
const freezeAuthority = Keypair.generate();

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const airdropSignature = await connection.requestAirdrop(
  payer.publicKey,
  1*LAMPORTS_PER_SOL,
);

await connection.confirmTransaction(airdropSignature);
console.log("airdrop done")


const mint = await createMint(
  connection,
  payer,
  // pg.Keypair,
  mintAuthority.publicKey,
  freezeAuthority.publicKey,
  9 // We are using 9 to match the CLI decimal default exactly
);

console.log(mint.toBase58());
// AQoKYV7tYpTrFZN6P5oUufbQKAUr9mNYGe1TTJC9wajM
console.log("mint done")

const mintInfo = await getMint(
  connection,
  mint
)

console.log(mintInfo.supply);
// 0
console.log("starting supply ! ^")

const tokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  payer,
  mint,
  payer.publicKey
)

console.log(tokenAccount.address.toBase58());
// 7UX2i7SucgLMQcfZ75s3VXmZZY4YRUyJN9X1RgfMoDUi
console.log("tokenacc add^^")

const tokenAccountInfo = await getAccount(
  connection,
  tokenAccount.address
)

console.log(tokenAccountInfo.amount);
// 0
console.log("Token No ^^")

await mintTo(
  connection,
  payer,
  mint,
  tokenAccount.address,
  mintAuthority,
  21000000000000000 // because decimals for the mint are set to 9 
)


const mintInfo = await getMint(
  connection,
  mint
)

console.log(mintInfo.supply);
// 100
console.log("Mint Supply ^^^ final")

const tokenAccountInfo = await getAccount(
  connection,
  tokenAccount.address
)

console.log(tokenAccountInfo.amount);
// 100
console.log("Transferred to acc ^^^")



// import {AccountLayout, TOKEN_PROGRAM_ID} from "@solana/spl-token";
// import {clusterApiUrl, Connection, PublicKey} from "@solana/web3.js";

// (async () => {

//   const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

//   const tokenAccounts = await connection.getTokenAccountsByOwner(
//     new PublicKey('8YLKoCu7NwqHNS8GzuvA2ibsvLrsg22YMfMDafxh1B15'),
//     {
//       programId: TOKEN_PROGRAM_ID,
//     }
//   );

//   console.log("Token                                         Balance");
//   console.log("------------------------------------------------------------");
//   tokenAccounts.value.forEach((tokenAccount) => {
//     const accountData = AccountLayout.decode(tokenAccount.account.data);
//     console.log(`${new PublicKey(accountData.mint)}   ${accountData.amount}`);
//   })

// })();

// /*
// Token                                         Balance
// ------------------------------------------------------------
// 7e2X5oeAAJyUTi4PfSGXFLGhyPw2H8oELm1mx87ZCgwF  84
// AQoKYV7tYpTrFZN6P5oUufbQKAUr9mNYGe1TTJC9wajM  100
// AQoKYV7tYpTrFZN6P5oUufbQKAUr9mNYGe1TTJC9wajM  0
// AQoKYV7tYpTrFZN6P5oUufbQKAUr9mNYGe1TTJC9wajM  1
// */