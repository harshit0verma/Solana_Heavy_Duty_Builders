import {
    Connection,
    Keypair,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
    TransactionInstruction,
    clusterApiUrl,
} from '@solana/web3.js';
import * as borsh from "borsh";
import { Buffer } from "buffer";
// import { Buffer } from 'util';



// function createKeypairFromFile(path: string): Keypair {
//     return Keypair.fromSecretKey(
//         Buffer.from(JSON.parse(require('fs').readFileSync(path, "utf-8")))
//     )
// };


describe("PDAs", () => {

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    // const connection = new Connection(`http://localhost:8899`, 'confirmed');
    const payer = pg.wallet.keypair;
    const PROGRAM_ID: PublicKey = new PublicKey(
        "2J8VycCeUWk6f9Uqijq5R6wPExFwXraxxagXyCriZyEf"
    );

    class Assignable {
        constructor(properties) {
            Object.keys(properties).map((key) => {
                return (this[key] = properties[key]);
            });
        };
    };

    class PageVisits extends Assignable {
        toBuffer() { return Buffer.from(borsh.serialize(PageVisitsSchema, this)) }
        
        static fromBuffer(buffer: Buffer) {
            return borsh.deserialize(PageVisitsSchema, PageVisits, buffer);
        };
    };
    enum MyEnum {
  Harshit0verma,
  Harshitverma,
  Vermaharshitji
}
    const PageVisitsSchema = new Map([
        [ PageVisits, { 
            kind: 'struct', 
            fields: [['my_enum', { kind: 'enum', type: MyEnum }],
        ['page_visits', 'u64'],
        ['bump', 'u8']],
        }]
    ]);

    class IncrementPageVisits extends Assignable {
        toBuffer() { return Buffer.from(borsh.serialize(IncrementPageVisitsSchema, this)) }
    };
    const IncrementPageVisitsSchema = new Map([
        [ IncrementPageVisits, { 
            kind: 'struct', 
            fields: [],
        }]
    ]);

    const testUser = pg.wallet.keypair;

    // it("Create a test user", async () => {
    //     let ix = SystemProgram.createAccount({
    //         fromPubkey: payer.publicKey,
    //         lamports: await connection.getMinimumBalanceForRentExemption(0),
    //         newAccountPubkey: testUser.publicKey,
    //         programId: SystemProgram.programId,
    //         space: 0,
    //     });
    //     await sendAndConfirmTransaction(
    //         connection,
    //         new Transaction().add(ix),
    //         [payer, testUser]
    //     );
    //     console.log(`Local Wallet: ${payer.publicKey}`);
    //     console.log(`Created User: ${testUser.publicKey}`);
    // });

    function derivePageVisitsPda(userPubkey: PublicKey) {
        return PublicKey.findProgramAddressSync(
            [Buffer.from("page_visits"), userPubkey.toBuffer()],
            PROGRAM_ID,
        )
    }

    it("Create the page visits tracking PDA", async () => {
        const [pageVisitsPda, pageVisitsBump] = derivePageVisitsPda(testUser.publicKey);
        let ix = new TransactionInstruction({
            keys: [
                {pubkey: pageVisitsPda, isSigner: false, isWritable: true},
                {pubkey: testUser.publicKey, isSigner: false, isWritable: false},
                {pubkey: payer.publicKey, isSigner: true, isWritable: true},
                {pubkey: SystemProgram.programId, isSigner: false, isWritable: false}
            ],
            programId: PROGRAM_ID,
            data: (new PageVisits({page_visits: 0, bump: pageVisitsBump})).toBuffer(),
        });
        await sendAndConfirmTransaction(
            connection, 
            new Transaction().add(ix),
            [payer]
        );
    });

    it("Visit the page!", async () => {
        const [pageVisitsPda, _] = derivePageVisitsPda(testUser.publicKey);
        let ix = new TransactionInstruction({
            keys: [
                {pubkey: pageVisitsPda, isSigner: false, isWritable: true},
                {pubkey: payer.publicKey, isSigner: true, isWritable: true},
            ],
            programId: PROGRAM_ID,
            data: new IncrementPageVisits({}).toBuffer(),
        });
        await sendAndConfirmTransaction(
            connection, 
            new Transaction().add(ix),
            [payer]
        );
    });


});