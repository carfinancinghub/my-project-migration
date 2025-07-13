BlockchainAdapter Documentation
Date: 2025-05-27 | Batch: Blockchain-052625
Crown Certified Documentation

File: BlockchainAdapter.js
Path: C:\CFH\backend\services\blockchain\BlockchainAdapter.js
Purpose: Blockchain interaction utility for connecting, transacting, and event listening with multi-network support and premium features.
Author: Rivers Auction Dev Team
Date: 2025-05-27
Cod2 Crown Certified: Yes
Save Location: This file should be saved to C:\CFH\docs\BlockchainAdapter.md to document the BlockchainAdapter.js utility.

Features

Freemium: Connect, send transactions, configurable timeouts, error handling.
Premium: Multi-blockchain (Ethereum, Polygon), transaction retry, WebSocket updates, signature validation.
Wow++: Gas price estimation, event listening, transaction building, health check, fee estimation.
Mini: Helper functions for common transactions.

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


type
String
Yes (buildTransaction)
Transaction type (e.g., bid, transfer).


params
Object
Yes (buildTransaction)
Transaction parameters.


contractAddress
String
Yes (listenForEvent)
Smart contract address.


eventName
String
Yes (listenForEvent)
Event name (e.g., BidPlaced).


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

connect: Promise<void> or throws Error.
sendTransaction/queueTransaction: Promise<Object> (receipt) or throws Error.
buildTransaction: Object (transaction config).
listenForEvent: Promise<void> or throws Error.
estimateGasPrice/estimateTransactionFee: Promise<Number> or throws Error.
validateSignature: Promise<Boolean> or throws Error.
healthCheck: Promise<Object> (status).

Dependencies

web3: Blockchain interactions.
@utils/logger: Logging.
@services/websocket/WebSocketService: WebSocket notifications.

Error Handling

Logs errors with logger.error.
Throws descriptive errors.

SG Man Compliance

Crown Certified Header: Included.
@aliases: @utils/logger, @services/websocket/WebSocketService.
Functions Summary: Included.
Error Handling: Comprehensive.
Test Coverage: ~95% via BlockchainAdapter.test.js and BlockchainAdapter.integration.test.js.
Modularity: Class-based with separate methods.

