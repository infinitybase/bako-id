const withSafe = process.argv.includes('--safe');

const bootstrap = async () => {
  if (withSafe) {
    const { addAssetsSafe } = await import('./add-asset-safe');
    await addAssetsSafe();
  } else {
    const { addAssetsEoa } = await import('./add-asset-eoa');
    await addAssetsEoa();
  }
};

bootstrap()
  .then(() => {
    console.log('Deployment completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });