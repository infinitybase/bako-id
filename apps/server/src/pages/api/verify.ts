import { middleware } from '@/middleware';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Executar a função middleware
  const response = middleware(req);

  // Verificar se a autenticação falhou
  if (response.status !== 200) {
    return res.status(response.status).json(response.body);
  }

  // Prosseguir com o processamento da requisição
  res.status(200).json({ message: 'Autenticação bem-sucedida' });
}
