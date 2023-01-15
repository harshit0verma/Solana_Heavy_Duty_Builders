import {
    Connection,
    Keypair,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';
import * as borsh from "borsh";
import { Buffer } from "buffer";

  //helper function
  const secret = Uint8Array.from([235,40,10,64,103,203,112,117,0,161,229,107,59,46,85,214,156,63,28,86,234,180,40,202,130,28,93,92,93,20,0,154,200,252,178,189,229,217,189,78,149,73,178,38,122,198,198,165,141,226,197,19,200,160,236,246,5,137,186,163,99,100,121,227]);
  const payer_key = Keypair.fromSecretKey(secret);
  



   const connection = new Connection(
        `https://api.devnet.solana.com`, 
        'confirmed'
    );
    const payer = payer_key;
    const PROGRAM_ID: PublicKey = new PublicKey(
        "2FWchyF2hvJrpwuXzxmucb1UQd7tVbEpnJMWVe1gHXuN"
    );

    class Assignable {
        constructor(properties) {
            Object.keys(properties).map((key) => {
                return (this[key] = properties[key]);
            });
        };
    };

    class AddressInfo extends Assignable {
        toBuffer() { return Buffer.from(borsh.serialize(AddressInfoSchema, this)) }
        
        static fromBuffer(buffer: Buffer) {
            return borsh.deserialize(AddressInfoSchema, AddressInfo, buffer);
        };
    };
    const AddressInfoSchema = new Map([
        [ AddressInfo, { 
            kind: 'struct', 
            fields: [ 
                ['name', 'string'], 
                ['house_number', 'u8'], 
            ],
        }]
    ]);

    const addressInfoAccount = Keypair.generate();

    async function main2()  {
    console.log("Create the address info account");
        console.log(`Payer Address      : ${payer.publicKey}`);
        console.log(`Address Info Acct  : ${addressInfoAccount.publicKey}`);
        let ix = new TransactionInstruction({
            keys: [
                {pubkey: addressInfoAccount.publicKey, isSigner: true, isWritable: true},
                {pubkey: payer.publicKey, isSigner: true, isWritable: true},
                {pubkey: SystemProgram.programId, isSigner: false, isWritable: false}
            ],
            programId: PROGRAM_ID,
            data: (
                new AddressInfo({
                    name: "Harshit Verma",
                    house_number: 123,
                })
            ).toBuffer(),
        });
        await sendAndConfirmTransaction(
            connection, 
            new Transaction().add(ix),
            [payer, addressInfoAccount]
        );
        }
    async function main3()  {
    console.log("Read the new account's data"); 
      console.log(addressInfoAccount.publicKey);
        // const accountInfo = await connection.getAccountInfo(addressInfoAccount.publicKey);
        // const readAddressInfo = AddressInfo.fromBuffer(accountInfo.data);
        // console.log(`Name     : ${readAddressInfo}`);
        // console.log(`House Num: ${readAddressInfo.house_number}`);
        // console.log(`Street   : ${readAddressInfo.street}`);
        // console.log(`City     : ${readAddressInfo.city}`);
    }
main2();
main3();