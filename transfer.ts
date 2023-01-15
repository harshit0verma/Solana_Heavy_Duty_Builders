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

/**
 * @dev put in the secret key using .env
 */
const secret_key = [];
  //helper function
  const secret = Uint8Array.from(secret_key);
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