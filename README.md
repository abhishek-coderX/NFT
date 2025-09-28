# NFT Marketplace

This is a fully functional NFT marketplace built with Next.js and Thirdweb. It allows users to mint, list, and purchase NFTs on the Ethereum Sepolia testnet.

## Features

- View NFTs in a responsive gallery format
- View individual NFT details
- List your NFTs for sale with custom pricing
- Purchase NFTs directly through the marketplace
- View your owned NFTs in your profile
- Full wallet integration with Metamask or other web3 wallets

## Tech Stack

- Next.js
- TypeScript
- Thirdweb SDK (React hooks)
- CSS Modules
- Ethereum (Sepolia Testnet)

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/abhishek-coderX/NFT.git
cd NFT
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Smart Contracts

This marketplace interacts with two main contracts:
- NFT Collection: `0xF3f29879a59a19d0f469FE4800a2d9Db458c35A7`
- Marketplace: `0x8aa1Fb7aaa026b45D13B8c64F8c13D9DB40f7a26`

## Testing

To test the marketplace functionality:
1. Connect your wallet
2. Get some Sepolia test ETH from a faucet like https://sepoliafaucet.com/
3. Mint NFTs or list existing ones for sale
4. Use a different wallet to purchase listed NFTs

## Getting Started

Create a project using this example:

```bash
npx thirdweb create --template next-typescript-starter
```

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

On `pages/_app.tsx`, you'll find our `ThirdwebProvider` wrapping your app, this is necessary for our [hooks](https://portal.thirdweb.com/react) and
[UI Components](https://portal.thirdweb.com/ui-components) to work.

### Deploy to IPFS

Deploy a copy of your application to IPFS using the following command:

```bash
yarn deploy
```

## Learn More

To learn more about thirdweb and Next.js, take a look at the following resources:

- [thirdweb React Documentation](https://docs.thirdweb.com/react) - learn about our React SDK.
- [thirdweb TypeScript Documentation](https://docs.thirdweb.com/typescript) - learn about our JavaScript/TypeScript SDK.
- [thirdweb Portal](https://docs.thirdweb.com) - check our guides and development resources.
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

You can check out [the thirdweb GitHub organization](https://github.com/thirdweb-dev) - your feedback and contributions are welcome!

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).
