# HAjo: Decentralizing Community Savings with Trust, Tech & Transparency

## Project Track
**Track:** Financial Inclusion (Hedera Africa Hackathon 2025)

---

## Vision & Origin Story
HAjo (short for *Hedera Ajo*) was born out of the need to reimagine traditional African savings systems — known as Ajo, Esusu, or Thrift Contributions — using the power of decentralized technology. Across the continent, millions rely on rotating savings groups for survival, education, and business growth. However, these systems are plagued by recurring issues: defaults, fund mismanagement, inactivity due to unforeseen circumstances, and limited transparency.

Our vision is to **blend cultural trust systems with decentralized finance (DeFi) reliability**, creating a digital ecosystem where communities can save together without fear of mismanagement or loss. We aim to digitize and strengthen this long-standing cultural practice using Hedera’s scalable, low-cost, and sustainable infrastructure.

---

## Core Problem
1. **Default Risk:** Traditional savings rely heavily on mutual trust without collateral, leaving groups vulnerable when a member defaults.
2. **Inactivity Gaps:** Contributors sometimes become inactive due to illness, migration, or unforeseen disasters.
3. **Lack of Transparency:** Manual bookkeeping and group admin bias often lead to disputes and mistrust.
4. **Limited Accessibility:** Offline nature of Ajo groups restricts participation, especially across locations.
5. **No Verifiable Records:** Savings cycles lack traceable, auditable proof of participation and payout history.

---

## Our Solution: HAjo
**HAjo** decentralizes community savings through smart contracts and Hedera Hashgraph. Each contribution, payout, and membership record is cryptographically verifiable. Members can join from anywhere, access transparent histories, and enjoy automated payout mechanisms — all without intermediaries.

The platform was designed around three pillars:
1. **Trust by Code:** Smart contracts eliminate the need for manual oversight.
2. **Transparency by Ledger:** Every transaction is on-chain and auditable.
3. **Resilience by Design:** Inactivity protection and collateral systems ensure continuity.

---

## Hedera Integration Summary

### 1. Hedera Token Service (HTS)
We use HTS to tokenize user stakes and create a **Default Protection Pool Token** representing pooled insurance contributions. HTS was chosen for its **low-cost, scalable tokenization** (typical transaction cost: $0.001) and **native support for asset management without custom code overhead.**

**Transaction Types:**
- `TokenCreateTransaction` — for creating group tokens or collateral tokens.
- `TokenMintTransaction` — for issuing reward or insurance tokens.
- `TokenAssociateTransaction` — linking user wallets with tokens.

**Economic Justification:**
Hedera’s **predictable transaction fees** and **high throughput (10,000+ TPS)** allow affordable micropayments in thrift groups, ensuring inclusion for users with limited capital while maintaining on-chain verification.

### 2. Hedera Consensus Service (HCS)
HCS records immutable transaction logs for every contribution and payout cycle. This ensures **transparent group activity tracking** without a centralized intermediary.

**Transaction Types:**
- `TopicCreateTransaction` — for initializing group message topics.
- `TopicMessageSubmitTransaction` — for posting contribution and payout records.

**Economic Justification:**
At just **$0.0001 per message**, HCS provides a **cost-stable logging system**, supporting **trustless audit trails** for communities where manual tracking is error-prone or susceptible to fraud.

### 3. Hedera Smart Contracts Service (HSCS)
Smart contracts automate contribution collection, payout scheduling, and inactivity handling using Solidity contracts deployed on the Hedera Testnet.

**Transaction Types:**
- `ContractCreateTransaction` — deploys HAjo’s savings contract.
- `ContractExecuteTransaction` — executes periodic contributions and disbursements.

**Economic Justification:**
HSCS provides **ABFT (Asynchronous Byzantine Fault Tolerant) consensus**, guaranteeing finality and low latency. This is crucial for real-time payout triggers and multi-user fund disbursement in Africa’s community finance systems.

---

## Architecture Diagram

```text
          +-------------------+
          |  React Frontend   |
          | (MetaMask Login)  |
          +---------+---------+
                    |
                    | Web3 API Calls
                    v
          +-------------------+
          |  Node.js Backend  |
          |  (Express Server) |
          +---------+---------+
                    |
          +---------v---------+
          |  Hedera Network   |
          | HTS / HCS / HSCS  |
          +-------------------+
                    |
          +---------v---------+
          | Mirror Node Logs  |
          +-------------------+
```

**Data Flow Summary:**
1. Users interact via HAjo’s React DApp.
2. The backend relays transactions to Hedera.
3. Smart contracts execute on HSCS.
4. Logs and payouts are confirmed through HCS and displayed in real-time on the dashboard.

---

## Key Features
1. **Stakeholder Collateral System:** Each member or group locks a small stake or asset at the start to build trust and cover defaults.
2. **Inactivity Safety Option:** A system to handle cases where contributors become inactive due to natural events (e.g., illness, disaster), allowing paused or delegated contributions.
3. **Flexible Contribution Input:** Users can set both their total target contribution and preferred monthly payment amount.
4. **Group Search Feature:** A search bar to easily find and join existing contribution groups.
5. **Group Access Templates:** Ready-made group cards showing details of existing groups, where users can enter their access tokens to join.
6. **Default Protection Pool:** Smart contract-managed fund that auto-covers shortfalls from defaulters.
7. **Notifications & Tracking:** Alerts for deductions, payouts, and inactivity triggers.
8. **Security & Transparency:** Fully on-chain, role-based access, and audited contracts.

---

## Deployment & Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MetaMask / HashPack Wallet
- Access to [Hedera Testnet](https://portal.hedera.com/register)

### Steps to Run Locally
1. **Clone the Repository:**  
   `git clone https://github.com/adeemma/Hajo.git`

2. **Navigate to Project Folder:**  
   `cd Hajo`

3. **Install Dependencies:**  
   `npm install`

4. **Configure Environment Variables:**  
   Create a `.env` file (based on `.env.example`) and set up:
   ```bash
   HEDERA_OPERATOR_ID=0.0.xxxxx
   HEDERA_OPERATOR_KEY=302e...xxxx
   CONTRACT_ID=0.0.xxxxx
   TOKEN_ID=0.0.xxxxx
   ```

5. **Run Frontend:**  
   `npm start` (launches on `http://localhost:3000`)

6. **Run Backend Server:**  
   `node server.js` (optional if using Express middleware)

7. **Deploy Contracts:**  
   Use `scripts/deploy.js` to deploy Solidity contracts to Hedera Testnet.

---

## Running Environment
- Frontend: React app on `localhost:3000`
- Backend: Node.js (Express) API service
- Blockchain: Hedera Testnet with deployed smart contracts

---

## Deployed Hedera IDs (Testnet)
- **Smart Contract ID:** `0.0.5170623`
- **Default Pool Token ID:** `0.0.5170642`
- **HCS Topic ID:** `0.0.5170685`

---

## Security & Secrets
- **Never commit private keys or `.env` files.**
- Always include `.env.example` for variable structure.
- Judge credentials are shared securely in the DoraHacks submission form.

Example `.env.example`:
```bash
HEDERA_OPERATOR_ID=
HEDERA_OPERATOR_KEY=
CONTRACT_ID=
TOKEN_ID=
HCS_TOPIC_ID=
```

---

## Impact Vision
HAjo goes beyond code. It’s an effort to **digitally formalize the informal sector**, giving low-income and unbanked individuals access to trust-based financial systems powered by decentralized infrastructure. It bridges culture, community, and cryptography — ensuring that every group savings contribution, no matter how small, remains transparent, secure, and respected.

Future plans include:
- **Financial Identity Layer:** Generate decentralized financial reputation scores.
- **AI Integration:** Predict defaults and optimize rotation order using behavioral analytics.
- **Local Currency Onramp:** Fiat-to-token integration for stable community adoption.
- **Institutional Partnerships:** Collaborations with student cooperatives and credit unions.

---

## Team Members
- **Team Lead:** [Ismail Hassan Oladipupo (HassanIsmailTech)](https://github.com/hassanismailtech)
- **Frontend Developer (Lead):** [Emmanuel Adeyemi](https://github.com/adeemma/Hajo.git)
- **Smart Contract Developer:** Nnenna
- **Frontend Developer:** Buseiry Habeeb
- **Content Writer & PM:** Raheemah

---

## Pitch Deck & Certifications
- **Pitch Deck:** [HAjo Pitch Deck (Google Drive Link)](https://drive.google.com/file/d/175OUcmGmU1rd3_IFhvMLGqsecCqk4uoCazVUT0V9Ljc/view)
- **Hedera Certification:** *(https://certs.hashgraphdev.com/a5dd53a0-aff8-4aa2-9c86-fa4dfc132f92.pdf)*

---

## Contributing & Testing
We welcome contributions and external testing. To contribute:
1. Fork the repository.
2. Create a new branch (`feature/your-feature`).
3. Commit your changes with descriptive messages.
4. Open a Pull Request for review.

To run smart contract tests:
```bash
npx hardhat test
```

Lint and format the code:
```bash
npm run lint
npm run format
```

All commits must pass lint checks and contain concise, descriptive messages.

---

## Code Quality & Auditability
- Consistent **ESLint + Prettier** configuration.
- Modular folder structure (`/contracts`, `/frontend`, `/backend`, `/scripts`).
- Inline documentation for complex logic.
- Public repo for **complete auditability**.

---

## License
Licensed under the **MIT License**.

---
**HAjo** — Building Financial Trust from the Grassroots Up, powered by **Hedera Hashgraph**.

