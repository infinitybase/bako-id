export const getWalletSignatureErrorTitle = (
  error: Error,
  fallbackTitle: string
) => {
  return error.message?.includes('rejected') ||
    error.message?.includes('disconnected') ||
    error.message?.includes('cancelled')
    ? 'Signature Failed'
    : fallbackTitle;
};
