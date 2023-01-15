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


// import * as borsh from "borsh";
// import { Buffer } from "buffer";


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
const payer = pg.wallet.keypair;

const PROGRAM_ID: PublicKey = new PublicKey(
  "FhuaRZw6y8kuvygEejDtp9K9rR9LZoZ91XCnYS4Jyrvy"
);

let test1Recipient: PublicKey = new PublicKey(
    "H1Jjnk9zXpWi6pzCk2ddUxkH3DjJFiq5zGKoqALjLjoh"
  );


const transferAmount = 1 * LAMPORTS_PER_SOL;

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
