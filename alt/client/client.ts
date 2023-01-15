import {
    AddressLookupTableProgram,
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    TransactionInstruction, 
    VersionedTransaction,
    TransactionMessage,
} from '@solana/web3.js';



 async function sendTransactionV0(
    connection: Connection,
    instructions: TransactionInstruction[],
    payer: Keypair,
): Promise<void> {

    let blockhash = await connection
        .getLatestBlockhash()
        .then((res) => res.blockhash);
    
    const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: blockhash,
        instructions,
    }).compileToV0Message();
    
    const tx = new VersionedTransaction(messageV0);
    tx.sign([payer]);
    const sx = await connection.sendTransaction(tx);

    console.log(`** -- Signature: ${sx}`);
}


 async function sendTransactionV0WithLookupTable(
    connection: Connection,
    instructions: TransactionInstruction[],
    payer: Keypair,
    lookupTablePubkey: PublicKey,
): Promise<void> {

    const lookupTableAccount = await connection
        .getAddressLookupTable(lookupTablePubkey)
        .then((res) => res.value);

    let blockhash = await connection
        .getLatestBlockhash()
        .then((res) => res.blockhash);
    
    const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: blockhash,
        instructions,
    }).compileToV0Message([lookupTableAccount]);
    
    const tx = new VersionedTransaction(messageV0);
    tx.sign([payer]);
    const sx = await connection.sendTransaction(tx);
    
    console.log(`** -- Signature: ${sx}`);
}


 async function printAddressLookupTable(
    connection: Connection,
    lookupTablePubkey: PublicKey,
): Promise<void> {

    
    const lookupTableAccount = await connection
        .getAddressLookupTable(lookupTablePubkey)
        .then((res) => res.value);
    console.log(`Lookup Table: ${lookupTablePubkey}`);
    for (let i = 0; i < lookupTableAccount.state.addresses.length; i++) {
        const address = lookupTableAccount.state.addresses[i];
        console.log(`   Index: ${i}  Address: ${address.toBase58()}`);
    }
}


 async function printBalances(
    connection: Connection,
    timeframe: string,
    pubkeyOne: PublicKey,
    pubkeyTwo: PublicKey,
): Promise<void> {

    console.log(`${timeframe}:`);
    console.log(`   Test Account #1 balance : ${
        await connection.getBalance(pubkeyOne)
    }`);
    console.log(`   Test Account #2 balance : ${
        await connection.getBalance(pubkeyTwo)
    }`);
}













    const connection = new Connection(
        `https://api.devnet.solana.com`, 
        'confirmed'
    );

    const payer = pg.wallet.keypair;
    let lookupTablePubkey: PublicKey;
    const testAccountOne = Keypair.generate();
    const testAccountTwo = Keypair.generate();
  
async function main1()  {
    console.log("Creating an address lookup table ")
        let ix: TransactionInstruction;
        [ix, lookupTablePubkey] = AddressLookupTableProgram.createLookupTable({
            authority: payer.publicKey,
            payer: payer.publicKey,
            recentSlot: await connection.getSlot(),
        });
        
        await sendTransactionV0(connection, [ix], payer);
        
        console.log("Pubkeys from generated keypairs:")
        console.log(`   Test Account #1: ${testAccountOne.publicKey}`);
        console.log(`   Test Account #2: ${testAccountTwo.publicKey}`);
        await printAddressLookupTable(connection, lookupTablePubkey);
    }

async function main2() {
        console.log("Add some addresses to the ALT");
        const ix = AddressLookupTableProgram.extendLookupTable({
            addresses: [
                testAccountOne.publicKey, 
                testAccountTwo.publicKey
            ],
            authority: payer.publicKey,
            lookupTable: lookupTablePubkey,
            payer: payer.publicKey,
        });
        
        await sendTransactionV0(connection, [ix], payer);

        await printAddressLookupTable(connection, lookupTablePubkey);
    }



async function main3()  {
    console.log("Fund the first test account");
        
        const ix = SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: testAccountOne.publicKey,
            lamports: 100000000,
        });

        await sendTransactionV0(connection, [ix], payer);

        await printBalances(
            connection, "After", testAccountOne.publicKey, testAccountTwo.publicKey
        );
    }

    // it("Send a transaction WITHOUT using the ALT", async () => {

    //     await printBalances(
    //         connection, "Before", testAccountOne.publicKey, testAccountTwo.publicKey
    //     );
        
    //     const ix = SystemProgram.transfer({
    //         fromPubkey: testAccountOne.publicKey,
    //         toPubkey: testAccountTwo.publicKey,
    //         lamports: 20000000,
    //     });

    //     await sendTransactionV0(connection, [ix], testAccountOne);

    //     await printBalances(
    //         connection, "After", testAccountOne.publicKey, testAccountTwo.publicKey
    //     );
    // });

async function main4()  {
        console.log("Now send that same transaction using the ALT");
        await printBalances(
            connection, "Before", payer.publicKey, testAccountOne.publicKey
        );
        
        const ix = SystemProgram.transfer({
            fromPubkey: testAccountOne.publicKey,
            toPubkey: testAccountTwo.publicKey,
            lamports: 20000000,
        });

        await sendTransactionV0WithLookupTable(
            connection, [ix], testAccountOne, lookupTablePubkey
        );

        await printBalances(
            connection, "After", testAccountOne.publicKey, testAccountTwo.publicKey
        );
        }


main1();
main2();
main3();
main4();