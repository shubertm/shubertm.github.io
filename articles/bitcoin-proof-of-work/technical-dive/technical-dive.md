# Bitcoin's Proof of Work: A Technical Dive

Mining bitcoins is a way of adding more money to the current circulating supply until we get to 21 million.
Primarily, it is the most effective way to keep away bad actors from controlling the money supply.
Bad actors can control the money supply by increasing or decreasing the rate at which new bitcoins are created,
double spending bitcoins and removing the 21 million cap, enforcing inflation. 
Therefore, free mutation of the Bitcoin ledger by any party is and should not be allowed.

This is why everyone proposing to make a change to the Bitcoin ledger must have solved a problem of a particular
difficulty. And they must present verifiable evidence of the solution to the problem. Only then can
every other node on the network accept their change and append it to their copy of the ledger, and start building 
on top of that change to propose their own changes.

At this point, it is better to bear in mind that this is all a computational process. We can now clearly understand
that **Proof of Work** is an easily verifiable result of a successful computational mining process.

Bitcoin is a network of independent computers (peers/nodes), each node runs software that enforces the same rules. So,
they should be able to understand data created independently by any of them. We will refer to a computer on the network as
a node from here through the rest of the article.
Each node, collects updated transaction data from peers to use for mining and verification.

After successful reception of transactions from peers, a node keeps the data in its RAM, this portion of computer
memory used by the Bitcoin software to hold transactions is called the mempool or memory pool. This is where the node verifies each transaction,
checking if it follows the consensus rules. Transactions breaking any of the rules will be rejected.
All valid transactions can be included in the next block through any other criteria set by the node itself,
therefore a node has a right to choose which transactions to include in the next block which it wants to create. 
For example they can prioritize transactions paying high fee, to maximize the block reward.

## A Bitcoin Transaction (Tx)

A transaction in Bitcoin is a piece of information that transfers ownership of funds from one user to another,
it carries inputs controlled by the sender and produces outputs controlled by the receiver once confirmed on the network.
Each input is an unspent transaction output (UTXO) locked by a particular script of conditions. The fulfillment of these 
conditions is the expenditure of the UTXO which generates new UTXO(s) locked by another script.

## A Bitcoin Block

A block is an assembly of valid transactions selected by a node from it's mempool. Once a node assembles transactions 
into a block template, it starts the mining process to create an actual valid block that is broadcast to the network 
once the required proof of work is found.
A block consists of a header and the list of transactions.

[A Block in Bitcoin Core](https://github.com/bitcoin/bitcoin/blob/47da4f9b716d11294d4fb0f30b04a7bcf128cc14/src/primitives/block.h#L26-L110)
```cpp
class CBlockHeader
{
public:
    // header
    int32_t nVersion;
    uint256 hashPrevBlock;
    uint256 hashMerkleRoot;
    uint32_t nTime;
    uint32_t nBits;
    uint32_t nNonce;


    CBlockHeader()
    {
        SetNull();
    }


    SERIALIZE_METHODS(CBlockHeader, obj) { READWRITE(obj.nVersion, obj.hashPrevBlock, obj.hashMerkleRoot, obj.nTime, obj.nBits, obj.nNonce); }


    void SetNull()
    {
        nVersion = 0;
        hashPrevBlock.SetNull();
        hashMerkleRoot.SetNull();
        nTime = 0;
        nBits = 0;
        nNonce = 0;
    }


    bool IsNull() const
    {
        return (nBits == 0);
    }


    uint256 GetHash() const;


    NodeSeconds Time() const
    {
        return NodeSeconds{std::chrono::seconds{nTime}};
    }


    int64_t GetBlockTime() const
    {
        return (int64_t)nTime;
    }
};




class CBlock : public CBlockHeader
{
public:
    // network and disk
    std::vector<CTransactionRef> vtx;


    // Memory-only flags for caching expensive checks
    mutable bool fChecked;                            // CheckBlock()
    mutable bool m_checked_witness_commitment{false}; // CheckWitnessCommitment()
    mutable bool m_checked_merkle_root{false};        // CheckMerkleRoot()


    CBlock()
    {
        SetNull();
    }


    CBlock(const CBlockHeader &header)
    {
        SetNull();
        *(static_cast<CBlockHeader*>(this)) = header;
    }


    SERIALIZE_METHODS(CBlock, obj)
    {
        READWRITE(AsBase<CBlockHeader>(obj), obj.vtx);
    }


    void SetNull()
    {
        CBlockHeader::SetNull();
        vtx.clear();
        fChecked = false;
        m_checked_witness_commitment = false;
        m_checked_merkle_root = false;
    }


    std::string ToString() const;
};
```

We are interested in `nBits` and the `nNonce` in the block header because they are the primary parameters for mining a 
block. 

The `nBits` is a 32-bit number that tells a node the difficulty of the computation work to be done 
inorder to find the proof of work for the current block. It is dynamic, changes at the rate of block production. 
The faster the blocks are produced, the high the difficulty, the slower the production the lower the difficulty. 
It is directly proportional to the hashrate, increasing with every additional hash power. This is to maintain the 
10-minute window between subsequent blocks.

The `nNonce` is also a 32-bit number that is used in the mining process for computing the block hash that satisfies `nBits`.
A mining node iterates over `nNonce` incrementing its value until a double `SHA256` hash of the block header satisfies `nBits`.

This is Bitcoin mining, the search for the proof of work which is the double `SHA256` hash of the block header that 
satisfies `nBits`.


[Creating a Block Template and Tx Assembling in Bitcoin Core](https://github.com/bitcoin/bitcoin/blob/47da4f9b716d11294d4fb0f30b04a7bcf128cc14/src/node/miner.cpp#L126-L244)
```cpp
std::unique_ptr<CBlockTemplate> BlockAssembler::CreateNewBlock()
{
    const auto time_start{SteadyClock::now()};


    resetBlock();


    pblocktemplate.reset(new CBlockTemplate());
    CBlock* const pblock = &pblocktemplate->block; // pointer for convenience


    // Add dummy coinbase tx as first transaction. It is skipped by the
    // getblocktemplate RPC and mining interface consumers must not use it.
    pblock->vtx.emplace_back();


    LOCK(::cs_main);
    CBlockIndex* pindexPrev = m_chainstate.m_chain.Tip();
    assert(pindexPrev != nullptr);
    nHeight = pindexPrev->nHeight + 1;


    pblock->nVersion = m_chainstate.m_chainman.m_versionbitscache.ComputeBlockVersion(pindexPrev, chainparams.GetConsensus());
    // -regtest only: allow overriding block.nVersion with
    // -blockversion=N to test forking scenarios
    if (chainparams.MineBlocksOnDemand()) {
        pblock->nVersion = gArgs.GetIntArg("-blockversion", pblock->nVersion);
    }


    pblock->nTime = TicksSinceEpoch<std::chrono::seconds>(NodeClock::now());
    m_lock_time_cutoff = pindexPrev->GetMedianTimePast();


    if (m_mempool) {
        LOCK(m_mempool->cs);
        m_mempool->StartBlockBuilding();
        addChunks();
        m_mempool->StopBlockBuilding();
    }


    const auto time_1{SteadyClock::now()};


    m_last_block_num_txs = nBlockTx;
    m_last_block_weight = nBlockWeight;


    // Create coinbase transaction.
    CMutableTransaction coinbaseTx;


    // Construct coinbase transaction struct in parallel
    CoinbaseTx& coinbase_tx{pblocktemplate->m_coinbase_tx};
    coinbase_tx.version = coinbaseTx.version;


    coinbaseTx.vin.resize(1);
    coinbaseTx.vin[0].prevout.SetNull();
    coinbaseTx.vin[0].nSequence = CTxIn::MAX_SEQUENCE_NONFINAL; // Make sure timelock is enforced.
    coinbase_tx.sequence = coinbaseTx.vin[0].nSequence;


    // Add an output that spends the full coinbase reward.
    coinbaseTx.vout.resize(1);
    coinbaseTx.vout[0].scriptPubKey = m_options.coinbase_output_script;
    // Block subsidy + fees
    const CAmount block_reward{nFees + GetBlockSubsidy(nHeight, chainparams.GetConsensus())};
    coinbaseTx.vout[0].nValue = block_reward;
    coinbase_tx.block_reward_remaining = block_reward;


    // Start the coinbase scriptSig with the block height as required by BIP34.
    // Mining clients are expected to append extra data to this prefix, so
    // increasing its length would reduce the space they can use and may break
    // existing clients.
    coinbaseTx.vin[0].scriptSig = CScript() << nHeight;
    // Set script_sig_prefix here, so IPC mining clients are not affected by
    // the optional scriptSig padding below. They provide their own extraNonce,
    // and in a typical setup a pool name or realistic extraNonce already makes
    // the scriptSig long enough.
    coinbase_tx.script_sig_prefix = coinbaseTx.vin[0].scriptSig;
    if (nHeight <= 16) {
        // For blocks at heights <= 16, the BIP34-encoded height alone is only
        // one byte. Consensus requires coinbase scriptSigs to be at least two
        // bytes long (bad-cb-length), so an OP_0 is always appended at those
        // heights.
        coinbaseTx.vin[0].scriptSig << OP_0;
    }
    Assert(nHeight > 0);
    coinbaseTx.nLockTime = static_cast<uint32_t>(nHeight - 1);
    coinbase_tx.lock_time = coinbaseTx.nLockTime;


    pblock->vtx[0] = MakeTransactionRef(std::move(coinbaseTx));
    m_chainstate.m_chainman.GenerateCoinbaseCommitment(*pblock, pindexPrev);


    const CTransactionRef& final_coinbase{pblock->vtx[0]};
    if (final_coinbase->HasWitness()) {
        const auto& witness_stack{final_coinbase->vin[0].scriptWitness.stack};
        // Consensus requires the coinbase witness stack to have exactly one
        // element of 32 bytes.
        Assert(witness_stack.size() == 1 && witness_stack[0].size() == 32);
        coinbase_tx.witness = uint256(witness_stack[0]);
    }
    if (const int witness_index = GetWitnessCommitmentIndex(*pblock); witness_index != NO_WITNESS_COMMITMENT) {
        Assert(witness_index >= 0 && static_cast<size_t>(witness_index) < final_coinbase->vout.size());
        coinbase_tx.required_outputs.push_back(final_coinbase->vout[witness_index]);
    }


    LogInfo("CreateNewBlock(): block weight: %u txs: %u fees: %ld sigops %d\n", GetBlockWeight(*pblock), nBlockTx, nFees, nBlockSigOpsCost);


    // Fill in header
    pblock->hashPrevBlock  = pindexPrev->GetBlockHash();
    UpdateTime(pblock, chainparams.GetConsensus(), pindexPrev);
    pblock->nBits          = GetNextWorkRequired(pindexPrev, pblock, chainparams.GetConsensus());
    pblock->nNonce         = 0;


    if (m_options.test_block_validity) {
        if (BlockValidationState state{TestBlockValidity(m_chainstate, *pblock, /*check_pow=*/false, /*check_merkle_root=*/false)}; !state.IsValid()) {
            throw std::runtime_error(strprintf("TestBlockValidity failed: %s", state.ToString()));
        }
    }
    const auto time_2{SteadyClock::now()};


    LogDebug(BCLog::BENCH, "CreateNewBlock() chunks: %.2fms, validity: %.2fms (total %.2fms)\n",
             Ticks<MillisecondsDouble>(time_1 - time_start),
             Ticks<MillisecondsDouble>(time_2 - time_1),
             Ticks<MillisecondsDouble>(time_2 - time_start));


    return std::move(pblocktemplate);
}
```

[Mining a Block](https://github.com/bitcoin/bitcoin/blob/47da4f9b716d11294d4fb0f30b04a7bcf128cc14/src/rpc/mining.cpp#L168-L193)
```cpp
static bool GenerateBlock(ChainstateManager& chainman, CBlock&& block, uint64_t& max_tries, std::shared_ptr<const CBlock>& block_out, bool process_new_block)
{
    block_out.reset();
    block.hashMerkleRoot = BlockMerkleRoot(block);


    while (max_tries > 0 && block.nNonce < std::numeric_limits<uint32_t>::max() && !CheckProofOfWork(block.GetHash(), block.nBits, chainman.GetConsensus()) && !chainman.m_interrupt) {
        ++block.nNonce;
        --max_tries;
    }
    if (max_tries == 0 || chainman.m_interrupt) {
        return false;
    }
    if (block.nNonce == std::numeric_limits<uint32_t>::max()) {
        return true;
    }


    block_out = std::make_shared<const CBlock>(std::move(block));


    if (!process_new_block) return true;


    if (!chainman.ProcessNewBlock(block_out, /*force_processing=*/true, /*min_pow_checked=*/true, nullptr)) {
        throw JSONRPCError(RPC_INTERNAL_ERROR, "ProcessNewBlock, block not accepted");
    }


    return true;
}
```

## References
1. [The Whitepaper](https://bitcoin.org/bitcoin.pdf)