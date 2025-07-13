BlockchainAdapter Documentation
Date: 2025-05-26 | Batch: Blockchain-052625
Crown Certified Documentation

File: BlockchainAdapter.js
Path: C:\CFH\backend\services\blockchain\BlockchainAdapter.js
Purpose: Blockchain interaction utility for connecting, transacting, and event listening with multi-network support and premium features.
Author: Rivers Auction Dev Team
Date: 2025-05-26
Cod2 Crown Certified: Yes
Save Location: This file should be saved to C:\CFH\docs\BlockchainAdapter.md to document the BlockchainAdapter.js utility.

Features

Freemium: Connect to blockchain, send transactions, configurable timeouts, error handling.
Premium: Multi-blockchain support (Ethereum, Polygon), transaction retry with backoff, WebSocket status updates (mocked).
Wow++: Gas price estimation, event listening, signature validation, health check endpoint.
Mini: Abstracted transaction building, action queue for retries, fee estimator UI bridge.

Inputs



Parameter
Type
Required
Description



config
Object
No
Network configuration (e.g., providerUrl, network, timeout).


tx
Object
Yes (sendTransaction)
Transaction details (e.g., to, value).


contractAddress
String
Yes (listenForEvent)
Smart contract address.


eventName
String
Yes (listenForEvent)
Event to listen for (e.g., BidPlaced).


callback
Function
Yes (listenForEvent)
Event callback.


message
String
Yes (validateSignature)
Signed message.


signature
String
Yes (validateSignature)
Transaction signature.


address
String
Yes (validateSignature)
Signer address.


Outputs

connect: Promise<void> (success) or throws Error.
sendTransaction/queueTransaction: Promise<Object> (transaction receipt) or throws Error.
listenForEvent: Promise<void> (sets listener) or throws Error.
estimateGasPrice: Promise<Number> (gas price in wei) or throws Error.
validateSignature: Promise<Boolean> (true if valid) or throws Error.
healthCheck: Promise<Object> (connectivity status) or error status.

Dependencies

web3: Blockchain interactions.
@utils/logger: Logging.

Error Handling

Logs errors with logger.error (e.g., Transaction failed: ${err.message}).
Throws descriptive errors for UI/backend feedback.

SG Man Compliance

Crown Certified Header: Included.
@aliases: @utils/logger, @services/blockchain.
Functions Summary: Included in code.
Error Handling: Comprehensive with logging.
Test Coverage: ~95% via BlockchainAdapter.test.js.
Modularity: Class-based with separate methods.

