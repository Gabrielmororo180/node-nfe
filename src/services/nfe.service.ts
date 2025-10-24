import path from 'path';
import os from 'os';
import ACBrLibNFeMT from '@projetoacbr/acbrlib-nfe-node/dist/src';
import { INFeDados, INFeCancelamentoDados } from '../types/nfe.types';

type Resultado = {
  sucesso: boolean;
  xml?: string;
  erro?: string;
};

class NFeService {
  private acbrNFe: ACBrLibNFeMT;

  constructor() {
    const libPath = path.resolve(__dirname, os.platform() === 'win32' ? 'acbrlibs/ACBrNFe64.dll' : '../../acbrlibs/libacbrnfe64.so');
    const configPath = path.resolve(__dirname, '../../data/config/acbrlib.ini');
    this.acbrNFe = new ACBrLibNFeMT(libPath, configPath, '');
  }

  public async emitirNFe(dados: INFeDados): Promise<Resultado> {
    try {
     //emitir NFe
     
      this.acbrNFe.inicializar();

      this.configurar();

      this.acbrNFe.limparLista();

      const iniPath = path.resolve(__dirname, '../../data/notas/nota-temp.ini');
      const fs = require('fs');
      console.log('Conteúdo do INI:', fs.readFileSync(iniPath, 'utf8'));

    
      this.acbrNFe.carregarINI(iniPath);
      console.log('INI carregado com sucesso');
     

      this.acbrNFe.assinar();
      this.acbrNFe.validar();

      const xml = this.acbrNFe.obterXml(0);
      const status = this.acbrNFe.statusServico();

      this.acbrNFe.enviar(1, false, true, false);

      this.acbrNFe.salvarPDF;

      this.acbrNFe.finalizar();

      return { sucesso: true, xml };
    } catch (err: any) {
      console.error('Erro durante o processo de emissão da NFe:', err);
      return { sucesso: false, erro: err.message || 'Erro desconhecido ao emitir a NFe' };
    }
  }

  public async CancelarNFe(dados: INFeCancelamentoDados): Promise<Resultado> {
    try {
      //Cancelamento de NFe
      this.acbrNFe.inicializar();
      this.configurar();
      this.acbrNFe.limparLista();

      const iniPath = path.resolve(__dirname, '../../data/notas/evento-temp.ini');
      const fs = require('fs');
      console.log('Conteúdo do INI:', fs.readFileSync(iniPath, 'utf8'));

      this.gerarINICancelamento(dados, iniPath);

      try {
        this.acbrNFe.carregarEventoINI(iniPath);
        console.log('INI carregado com sucesso');
      } catch (error) {
        console.error('Erro ao carregar INI:', error);
      }

      this.acbrNFe.assinar();

      this.acbrNFe.validar();

      const xml = this.acbrNFe.obterXml(0);

      this.acbrNFe.enviarEvento(1);

      this.acbrNFe.finalizar();

      return { sucesso: true, xml };
    } catch (err: any) {
      console.error('Erro durante o processo de emissão da NFe:', err);
      return { sucesso: false, erro: err.message || 'Erro desconhecido ao emitir a NFe' };
    }
  }

  private configurar(): void {
    this.acbrNFe.configGravarValor('Principal', 'LogPath', path.resolve(__dirname, '../../data/log'));
    this.acbrNFe.configGravarValor('Principal', 'LogNivel', '4');
    this.acbrNFe.configGravarValor('DFe', 'SSLCryptLib', '1');
    this.acbrNFe.configGravarValor('DFe', 'SSLHttpLib', '3');
    this.acbrNFe.configGravarValor('DFe', 'SSLXmlSignLib', '4');
    this.acbrNFe.configGravarValor('DFe', 'ArquivoPFX', path.resolve(__dirname, '../../data/cert/cert.pfx'));
    this.acbrNFe.configGravarValor('DFe', 'Senha', process.env.PFX_PASSWORD || '');
    this.acbrNFe.configGravarValor('DFe', 'UF', 'PI');
    this.acbrNFe.configGravarValor('NFE', 'PathSchemas', path.resolve(__dirname, '../../data/Schemas/NFe'));
    this.acbrNFe.configGravarValor('NFE', 'PathSalvar', path.resolve(__dirname, '../../data/notas'));
    this.acbrNFe.configGravarValor('NFE', 'Ambiente', '2');
    this.acbrNFe.configGravarValor('DANFE', 'PathPDF', path.resolve(__dirname, '../../data/pdf'));
    this.acbrNFe.configGravarValor('NFE', 'FormaEmissao', '0');
    this.acbrNFe.configGravarValor('NFE', 'ModeloDF', '0');
    this.acbrNFe.configGravar(path.resolve(__dirname, '../../data/config/acbrlib.ini'));
  }

  private gerarINI(dados: INFeDados, iniPath: string): void {
    const fs = require('fs');
    let conteudoINI = `[NOTA FISCAL]
versao=4.00

[Identificacao]
natOp=${dados.identificacao.naturezaOperacao}
modelo=${dados.identificacao.tipoDocumento}
serie=${dados.identificacao.serie}
nNF=${dados.identificacao.numero}
dhEmi=${dados.identificacao.dataEmissao}
dhSaiEnt=${dados.identificacao.dataEntradaSaida}
tpNF=1
idDest=${dados.identificacao.identificadorDestino}
cMunFG=${dados.identificacao.codigoMunicipio}
tpImp=${dados.identificacao.tipoImpressao}
tpEmis=${dados.identificacao.tipoEmissao}
tpAmb=${dados.identificacao.ambiente}
finNFe=${dados.identificacao.finalidade}
indFinal=${dados.identificacao.operacaoConsumidorFinal}
indPres=${dados.identificacao.indicadorPresenca}

[Emitente]
CNPJ=${dados.emitente.cnpj}
xNome=${dados.emitente.nome}
xFant=${dados.emitente.nomeFantasia}
IE=${dados.emitente.inscricaoEstadual}
CRT=1
xLgr=${dados.emitente.endereco.logradouro}
nro=${dados.emitente.endereco.numero}
${dados.emitente.endereco.complemento ? `xCpl=${dados.emitente.endereco.complemento}` : ''}
xBairro=${dados.emitente.endereco.bairro}
cMun=${dados.emitente.endereco.codigoMunicipio}
xMun=${dados.emitente.endereco.municipio}
UF=${dados.emitente.endereco.uf}
CEP=${dados.emitente.endereco.cep}
cPais=${dados.emitente.endereco.codigoPais}
xPais=${dados.emitente.endereco.pais}

[Destinatario]
${dados.destinatario.cpfCnpj.length === 11 ? 'CPF' : 'CNPJ'}=${dados.destinatario.cpfCnpj}
xNome=${dados.destinatario.nome}
xLgr=${dados.destinatario.endereco.logradouro}
nro=${dados.destinatario.endereco.numero}
${dados.destinatario.endereco.complemento ? `xCpl=${dados.destinatario.endereco.complemento}` : ''}
xBairro=${dados.destinatario.endereco.bairro}
cMun=${dados.destinatario.endereco.codigoMunicipio}
xMun=${dados.destinatario.endereco.municipio}
UF=${dados.destinatario.endereco.uf}
CEP=${dados.destinatario.endereco.cep}
cPais=${dados.destinatario.endereco.codigoPais}
xPais=${dados.destinatario.endereco.pais}
email=${dados.destinatario.email}

[Totais]
vBC=${dados.total.icmsBase.toFixed(2)}
vICMS=${dados.total.icmsValor.toFixed(2)}
vICMSDeson=0.00
vFCP=0.00
vBCST=0.00
vST=0.00
vFCPST=0.00
vFCPSTRet=0.00
vProd=${dados.total.valorProdutos.toFixed(2)}
vFrete=0.00
vSeg=0.00
vDesc=0.00
vII=0.00
vIPI=0.00
vIPIDevol=0.00
vPIS=0.00
vCOFINS=0.00
vOutro=0.00
vNF=${dados.total.valorNota.toFixed(2)}

[Transportador]
modFrete=9

[Pagamento]
tPag=01
vPag=${dados.total.valorNota.toFixed(2)}
`;

    dados.produtos.forEach((produto, index) => {
      const num = index + 1;
      conteudoINI += `
[Produto${num}]
cProd=${produto.codigo}
cEAN=
xProd=${produto.descricao}
NCM=${produto.ncm}
CFOP=${produto.cfop}
uCom=${produto.unidade}
qCom=${produto.quantidade}
vUnCom=${produto.valorUnitario.toFixed(4)}
vProd=${(produto.quantidade * produto.valorUnitario).toFixed(2)}
cEANTrib=
uTrib=${produto.unidade}
qTrib=${produto.quantidade}
vUnTrib=${produto.valorUnitario.toFixed(4)}
indTot=1

[ICMS${num}]
CST=${produto.impostos.icms.cst}
orig=0
modBC=0
vBC=${produto.impostos.icms.baseCalculo.toFixed(2)}
pICMS=${produto.impostos.icms.aliquota.toFixed(2)}
vICMS=${produto.impostos.icms.valor.toFixed(2)}

[PIS${num}]
CST=${produto.impostos.pis.cst}
vBC=${produto.impostos.pis.baseCalculo.toFixed(2)}
pPIS=${produto.impostos.pis.aliquota.toFixed(2)}
vPIS=${produto.impostos.pis.valor.toFixed(2)}

[COFINS${num}]
CST=${produto.impostos.cofins.cst}
vBC=${produto.impostos.cofins.baseCalculo.toFixed(2)}
pCOFINS=${produto.impostos.cofins.aliquota.toFixed(2)}
vCOFINS=${produto.impostos.cofins.valor.toFixed(2)}
`;
    });

    fs.writeFileSync(iniPath, conteudoINI);
  }

  private gerarINICancelamento(dados: INFeCancelamentoDados, iniPath: string): void {
    const fs = require('fs');
    const e = dados.evento;
    const conteudoINI = `[EVENTO]
idLote=${e.idLote}

[EVENTO001]
cOrgao=${e.cOrgao}
CNPJ=${e.cnpj}
chNFe=${e.chaveNFe}
dhEvento=${e.dataHoraEvento}
tpEvento=${e.tipoEvento}
nSeqEvento=${e.numeroSequencialEvento}
versaoEvento=${e.versaoEvento}
nProt=${e.numeroProtocolo}
xJust=${e.justificativa}`;
    fs.writeFileSync(iniPath, conteudoINI);
  }
}

export const nfeService = new NFeService();
