import {
  Client,
  PrivateKey,
  AccountId,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
  TransferTransaction,
  AccountBalanceQuery,
  TransactionId,
  Hbar,
  TokenAssociateTransaction,
} from '@hashgraph/sdk'

// Hedera network configurations
const networks = {
  mainnet: {
    client: Client.forMainnet(),
  },
  testnet: {
    client: Client.forTestnet(),
  },
  previewnet: {
    client: Client.forPreviewnet(),
  },
}

export class HederaService {
  private client: Client
  private network: 'mainnet' | 'testnet' | 'previewnet'

  constructor(network: 'mainnet' | 'testnet' | 'previewnet' = 'testnet') {
    this.network = network
    this.client = networks[network].client
  }

  // Validate private key format
  private validatePrivateKey(privateKeyStr: string): PrivateKey {
    try {
      const privateKey = PrivateKey.fromString(privateKeyStr)
      console.log('Public Key derived:', privateKey.publicKey.toString())
      return privateKey
    } catch (error: any) {
      console.error('Invalid private key format:', error.message)
      throw new Error(`Invalid private key: ${error.message}`)
    }
  }

  // Set operator for transactions
  setOperator(accountId: string, privateKey: string) {
    const validPrivateKey = this.validatePrivateKey(privateKey)
    this.client.setOperator(AccountId.fromString(accountId), validPrivateKey)
  }

  // Create a new HTS token for a savings group
  async createToken(
    name: string,
    symbol: string,
    initialSupply: number,
    treasuryAccountId: string,
    privateKey: string,
    adminKey?: string
  ) {
    try {
      const treasuryPrivateKey = this.validatePrivateKey(privateKey)
      const treasuryAccount = AccountId.fromString(treasuryAccountId)

      const transaction = new TokenCreateTransaction()
        .setTokenName(name)
        .setTokenSymbol(symbol)
        .setTokenType(TokenType.FungibleCommon)
        .setSupplyType(TokenSupplyType.Finite)
        .setInitialSupply(initialSupply)
        .setMaxSupply(initialSupply)
        .setDecimals(2)
        .setTreasuryAccountId(treasuryAccount)

      let adminPrivateKey: PrivateKey | undefined
      if (adminKey) {
        adminPrivateKey = this.validatePrivateKey(adminKey)
        transaction.setAdminKey(adminPrivateKey.publicKey)
      }

      // Set operator for the client
      this.client.setOperator(treasuryAccount, treasuryPrivateKey)

      transaction.freezeWith(this.client)

      // Sign the transaction with the treasury account's private key
      transaction.sign(treasuryPrivateKey)

      // If adminKey is provided and different from treasury key, sign with admin key as well
      if (adminPrivateKey && adminPrivateKey.toString() !== treasuryPrivateKey.toString()) {
        transaction.sign(adminPrivateKey)
      }

      console.log('Transaction before execution:', transaction.toString())

      const response = await transaction.execute(this.client)
      const receipt = await response.getReceipt(this.client)

      console.log('Transaction receipt:', receipt.status.toString())

      return {
        tokenId: receipt.tokenId?.toString(),
        status: receipt.status.toString(),
      }
    } catch (error: any) {
      console.error('Error creating token:', error)
      if (error.status) {
        console.error('Precheck status:', error.status.toString())
      }
      throw error
    }
  }

  // Transfer tokens between accounts
  async transferTokens(
    tokenId: string,
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    operatorAccountId: string,
    operatorPrivateKey: string
  ) {
    try {
      // Set operator for the client
      this.client.setOperator(AccountId.fromString(operatorAccountId), PrivateKey.fromString(operatorPrivateKey))

      const transaction = new TransferTransaction()
        .addTokenTransfer(tokenId, AccountId.fromString(fromAccountId), -amount)
        .addTokenTransfer(tokenId, AccountId.fromString(toAccountId), amount)

      const response = await transaction.execute(this.client)
      const receipt = await response.getReceipt(this.client)

      return {
        transactionId: response.transactionId.toString(),
        status: receipt.status.toString(),
      }
    } catch (error) {
      console.error('Error transferring tokens:', error)
      throw error
    }
  }

  // Associate token with an account
  async associateToken(accountId: string, tokenId: string, privateKey: string) {
    try {
      const transaction = new TokenAssociateTransaction()
        .setAccountId(AccountId.fromString(accountId))
        .setTokenIds([tokenId])

      const client = this.client
      client.setOperator(AccountId.fromString(accountId), PrivateKey.fromString(privateKey))

      const response = await transaction.execute(client)
      const receipt = await response.getReceipt(client)

      return {
        status: receipt.status.toString(),
      }
    } catch (error) {
      console.error('Error associating token:', error)
      throw error
    }
  }

  // Get account balance
  async getAccountBalance(accountId: string) {
    try {
      const query = new AccountBalanceQuery().setAccountId(AccountId.fromString(accountId))

      const balance = await query.execute(this.client)

      return {
        hbar: balance.hbars.toString(),
        tokens: balance.tokens,
      }
    } catch (error) {
      console.error('Error getting balance:', error)
      throw error
    }
  }

  // Get token balance for specific account
  async getTokenBalance(accountId: string, tokenId: string) {
    try {
      const balance = await this.getAccountBalance(accountId)
      const tokenBalance = balance.tokens?.get(tokenId)

      return tokenBalance ? tokenBalance.toString() : '0'
    } catch (error) {
      console.error('Error getting token balance:', error)
      throw error
    }
  }

  // Mint additional tokens (if needed for future features)
  async mintTokens(tokenId: string, amount: number, treasuryKey: string) {
    try {
      const transaction = new TokenMintTransaction()
        .setTokenId(tokenId)
        .setAmount(amount)

      const client = this.client
      // Set treasury as operator for minting
      const treasuryAccount = await this.getTreasuryAccount(tokenId)
      client.setOperator(treasuryAccount, PrivateKey.fromString(treasuryKey))

      const response = await transaction.execute(client)
      const receipt = await response.getReceipt(client)

      return {
        status: receipt.status.toString(),
      }
    } catch (error) {
      console.error('Error minting tokens:', error)
      throw error
    }
  }

  // Helper to get treasury account (simplified - would need token info query in real implementation)
  private async getTreasuryAccount(tokenId: string): Promise<AccountId> {
    // This is a placeholder - in real implementation, you'd query token info
    // For now, return a dummy account
    return AccountId.fromString('0.0.12345')
  }
}

// Export singleton instance
export const hederaService = new HederaService()
