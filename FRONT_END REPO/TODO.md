# TODO: Fix INVALID_SIGNATURE Error in Hedera Code

## Steps to Complete
- [x] Analyze the createToken method in lib/hedera.ts for signing issues
- [x] Add private key validation in HederaService
- [x] Modify createToken to sign with adminKey if provided
- [x] Remove manual transactionId setting to avoid conflicts
- [x] Add detailed error logging and handling
- [x] Test the fixes by running the application
- [ ] Verify no INVALID_SIGNATURE errors occur
