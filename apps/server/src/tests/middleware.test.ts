import { Signer, hashMessage } from 'fuels';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextRequest, NextResponse } from 'next/server';
import { middleware } from '../middleware';
import handler from '../pages/api/attest';

describe('Middleware', () => {
  const expectedMessageHash =
    '0x37eedced0e79e8af1d36f7e6b6ce51e0d1c331363322f2a2413c9fec7654982f';
  const expectedPrivateKey =
    '0x419f610bb96c07e2709706c6133bf29d0623340128e285d8207f90b7c182fe74';

  it('should return a 405 status code if the method is not POST', async () => {
    const req = {
      method: 'GET',
    } as NextApiRequest;

    const res = {
      status: jest.fn(() => ({
        json: jest.fn(),
      })),
    } as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('should return a 401 status code if authorization token was not provided', async () => {
    try {
      await middleware(
        {
          headers: {
            get: jest.fn(() => null),
          },
        } as unknown as NextRequest,
        {} as NextApiResponse,
      );
    } catch (error) {
      const err = error as NextResponse;
      expect(err.status).toBe(401);
    }
  });

  it('should return a 401 status code if the wallet address from token does not match with the address from attestation', async () => {
    try {
      await middleware(
        {
          headers: {
            get: jest.fn(() => 'Bearer token'),
          },
          json: jest.fn(() => ({
            id: 'id',
            app: 'app',
            handle: 'handle',
            address: 'address',
          })),
        } as unknown as NextRequest,
        {} as NextApiResponse,
      );
    } catch (error) {
      const err = error as NextResponse;
      expect(err.status).toBe(401);
    }
  });

  it('should verify the wallet address from token with the address from attestation', async () => {
    const signer = new Signer(expectedPrivateKey);
    const hashedMessage = hashMessage(expectedMessageHash);
    const signedMessage = signer.sign(hashedMessage);

    const response = (await middleware(
      {
        headers: {
          get: jest.fn(() => `Bearer ${signedMessage}`),
        },
        json: jest.fn(() => ({
          id: '0x123',
          app: 'farcaster',
          handle: 'my_handle',
          address: signer.address.toB256(),
        })),
      } as unknown as NextRequest,
      {} as NextApiResponse,
    )) as NextResponse;

    expect(response.status).toBe(200);
  });
});
