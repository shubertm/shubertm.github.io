# Bitcoin Keys and Addresses

In this writing we will discuss the mechanisms of receiving and spending Bitcoin from a sub-technical
scope. We start by looking at how Bitcoin payments are sent and received to ensure secure change of ownership
from one controlling entity to the next. Then we will look at how Bitcoin payment information is generated and shared.

## Keys
To use Bitcoin an entity require keys. Keys are used to claim ownership of coins on the decentralized
network of nodes. They are the most valuable piece to Bitcoin's acclaimed self sovereignty.
Bitcoin keys are generated in pairs because of the underlying cryptography which uses
an elliptic curve called `SECP256K1`. The pair should consist of a private key and a corresponding
public key.

### Private Key
A private key is a secret that an entity holds. It can absolutely be derived from anything so long as
it satisfies the elliptic curve mathematics, it should be valid enough to generate a valid
public key. To ensure the private key is strong and hard to guess, the derivation process should include
randomization to increase entropy. Private keys selected from predictable sources are very weak and can be broken
easily.

A private key is used to generate a public key. 
A private key is used to sign and authorize spending coins or transfer ownership of funds. 
It should never be shared to anyone whom you do not want to control or spend all your money. 

### Public Key
A public key is revealed to everybody on the network, it is generated from a private key using `SECP256K1`
elliptic curve.
By cryptographic design, there is only one public key corresponding to one private key, that is why no
entity can claim ownership to coins locked by a public key which they have no knowledge of the 
private key that generated it.

A public key is used to receive coins from other entities on the network, not forgetting that any 
entity can also send coins to themselves.
A public key is shared to other entities if they want to send coins to the owner.

A public key is shared in different formats which are called locking scripts. Locking scripts are built using
`Bitcoin Script`, a small and restricted programming language.
Locking scripts are the actual information an entity shares to receive a payment.
For the human eye locking scripts are hard to make sense of, therefore they are encoded into addresses.

## Addresses
An address is a readable format of a coin locking script. An address introduces a layer of communication which
ordinary human users can understand without any difficulty and conveniently use with ease. Computers could just share
`Bitcoin Script` to make transactions amongst themselves. Addresses are a common terminology when receiving and spending
Bitcoin.

Locking scripts are encoded into addresses using different procedures based on the type of the standard locking script.

### Standard Locking Scripts

#### Legacy
- P2PK (Pay to Public Key)
  - Has no address format
- P2PKH (Pay to Public Key Hash)
  - Encoded to address using `Base58`
- P2SH (Pay to Script Hash)
  - Encoded to address using `Base58`

#### Segregated Witness (Segwit)
- P2WPKH (Pay to Witness Public Key Hash)
  - Encoded to address using `Bech32`
- P2WSH (Pay to Witness Script Hash)
  - Encoded to address using `Bach32`

#### Taproot
- P2TR (Pay to Taproot)
  - Encoded to address using `Bech32m`

## Conclusion
Participation in the Bitcoin network is voluntary in all aspects, but to be a partaker of what Satoshi Nakamoto has
bestowed upon us, keys are paramount. A private key for spending and a public key for receiving payments. Addresses for
easy communication on how to lock any value of bitcoin that is changing ownership.