const isSafe = process.argv.includes('--safe');

const main = async () => {
  if (isSafe) {
    const { deployContractsSafe } = await import('./deploy-safe');
    await deployContractsSafe();
  } else {
    const { deployContractsEOA } = await import('./deploy-eoa');
    await deployContractsEOA();
  }
}

main()
  .then(() => {
    console.log('Deployment completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });