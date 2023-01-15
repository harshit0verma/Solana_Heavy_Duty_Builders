import {
    PublicKey,
    SystemProgram,
    TransactionInstruction,
    clusterApiUrl,
      Connection,
      Keypair,
      LAMPORTS_PER_SOL,
      // PublicKey,
      sendAndConfirmTransaction,
      // SystemProgram,
      Transaction,
  } from '@solana/web3.js';
  
  
  import * as borsh from "borsh";
  import { Buffer } from "buffer";
  
  //helper function
const secret = Uint8Array.from([235,40,10,64,103,203,112,117,0,161,229,107,59,46,85,214,156,63,28,86,234,180,40,202,130,28,93,92,93,20,0,154,200,252,178,189,229,217,189,78,149,73,178,38,122,198,198,165,141,226,197,19,200,160,236,246,5,137,186,163,99,100,121,227]);
const payer_key = Keypair.fromSecretKey(secret);

  enum InstructionType {
    CpiTransfer,
    ProgramTransfer,
  }
  
  class TransferInstruction {
    instruction: InstructionType;
    amount: number;
  
    constructor(props: { instruction: InstructionType; amount: number }) {
      this.instruction = props.instruction;
      this.amount = props.amount;
    }
  
    toBuffer() {
      return Buffer.from(borsh.serialize(TransferInstructionSchema, this));
    }
  
    static fromBuffer(buffer: Buffer) {
      return borsh.deserialize(
        TransferInstructionSchema,
        TransferInstruction,
        buffer
      );
    }
  }
  
  const TransferInstructionSchema = new Map([
    [
      TransferInstruction,
      {
        kind: "struct",
        fields: [
          ["instruction", "u8"],
          ["amount", "u64"],
        ],
      },
    ],
  ]);
  
  function createTransferInstruction(
    payerPubkey: PublicKey,
    recipientPubkey: PublicKey,
    programId: PublicKey,
    instruction: InstructionType,
    amount: number
  ): TransactionInstruction {
    const instructionObject = new TransferInstruction({
      instruction,
      amount,
    });
  
    const ix = new TransactionInstruction({
      keys: [
        { pubkey: payerPubkey, isSigner: true, isWritable: true },
        { pubkey: recipientPubkey, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId,
      data: instructionObject.toBuffer(),
    });
  
    return ix;
  }
  
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const payer = payer_key;
  
  const PROGRAM_ID: PublicKey = new PublicKey(
    "FhuaRZw6y8kuvygEejDtp9K9rR9LZoZ91XCnYS4Jyrvy"
  );
  
  let test1Recipient: PublicKey = new PublicKey(
      "H1Jjnk9zXpWi6pzCk2ddUxkH3DjJFiq5zGKoqALjLjoh"
    );
  
  
  const transferAmount = 1 * LAMPORTS_PER_SOL;
// const transaction = new web3.Transaction();
  
async function main() {

          let ix = createTransferInstruction(
              payer.publicKey,
              test1Recipient,
              PROGRAM_ID,
              InstructionType.CpiTransfer,
              transferAmount
          );
  
          await sendAndConfirmTransaction(
              connection, 
              new Transaction().add(ix),
              [payer]
          );
    
  console.log("completed");
          }
          main().then(
            () => process.exit(),
            err => {
                console.error(err);
                process.exit(-1);
            },
          );
  