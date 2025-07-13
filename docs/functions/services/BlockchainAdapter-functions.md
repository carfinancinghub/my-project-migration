BlockchainAdapter Functions Documentation
Date: 2025-05-27 | Batch: Blockchain-052625
Crown Certified Documentation

File: BlockchainAdapter-functions.md
Path: C:\CFH\docs\functions\services\BlockchainAdapter-functions.md
Purpose: Detailed documentation of BlockchainAdapter.js functions.
Author: Rivers Auction Dev Team
Date: 2025-05-27
Cod2 Crown Certified: Yes
Save Location: This file should be saved to C:\CFH\docs\functions\services\BlockchainAdapter-functions.md to document the functions of BlockchainAdapter.js.

Functions



Function
Purpose
Inputs
Outputs
Dependencies



BlockchainAdapter
Initializes adapter
config: Object
BlockchainAdapter instance
web3, @utils/logger, @services/websocket/WebSocketService


connect
Connects to blockchain
None
Promise<void>
web3, @utils/logger


sendTransaction
Sends a transaction
tx: Object
Promise<Object>
web3, @utils/logger, @services/websocket/WebSocketService


buildTransaction
Builds transaction types
type: String, params: Object
Object
web3


listenForEvent
Listens for events
contractAddress: String, eventName: String, callback: Function
Promise<void>
web3, @utils/logger


estimateGasPrice
Estimates gas price
None
Promise<Number>
web3, @utils/logger


validateSignature
Validates signature
message: String, signature: String, address: String
Promise<Boolean>
web3, @utils/logger


estimateTransactionFee
Estimates fee
tx: Object
Promise<Number>
web3, @utils/logger


healthCheck
Checks connectivity
None
Promise<Object>
web3, @utils/logger


queueTransaction
Queues transaction with retries
tx: Object, retries: Number
Promise<Object>
web3, @utils/logger, @services/websocket/WebSocketService


Error Handling

Logs errors with logger.error.
Throws descriptive errors.

SG Man Compliance

Crown Certified Header: Included.
Test Coverage: Validated via BlockchainAdapter.test.js and BlockchainAdapter.integration.test.js.

