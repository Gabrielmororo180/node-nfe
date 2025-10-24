
import { Request, Response } from 'express';
import { nfeService } from '../services/nfe.service';
import { INFeCancelamentoDados, INFeDados } from '../types/nfe.types';

export class NFEController {
  public async emitirNFe(req: Request, res: Response): Promise<Response> {
    try {
      const dados: INFeDados = req.body;
      
      // Validação básica dos dados
      if (!dados.identificacao || !dados.emitente || !dados.destinatario || !dados.produtos || !dados.total) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Dados inválidos. Todos os campos obrigatórios devem ser preenchidos.'
        });
      }

      const result = await nfeService.emitirNFe(dados);
      
    return res.json(result);
    } catch (error) {
   
      return res.status(500).json({
        sucesso: false,
        erro: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  }

  public async CancelarNFe(req: Request, res: Response): Promise<Response> {
    try {
      const dados: INFeCancelamentoDados = req.body;
      
    

      const result = await nfeService.CancelarNFe(dados);
      
    return res.json(result);
    } catch (error) {
 
      return res.status(500).json({
        sucesso: false,
        erro: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  }

}

export const nfeController = new NFEController();