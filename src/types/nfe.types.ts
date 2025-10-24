
export interface INFeConfig {
  DFe: {
    ArquivoPFX: string;
    Senha: string;
    SSLCryptLib: string;
    SSLHttpLib: string;
    SSLXmlSignLib: string;
  };
  NFE: {
    Ambiente: string;
    PathSalvar: string;
    PathSchemas: string;
  };
  DANFE: {
    PathPDF: string;
  };
  Principal: {
    LogPath: string;
  };
}

export interface INFeResponse {
  sucesso: boolean;
  xml: string;
}

export interface IDestinatario {
  nome: string;
  cpfCnpj: string;
  email: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    codigoMunicipio: string;
    municipio: string;
    uf: string;
    cep: string;
    pais: string;
    codigoPais: string;
  };
}

export interface IProduto {
  codigo: string;
  descricao: string;
  ncm: string;
  cfop: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  impostos: {
    icms: {
      cst: string;
      baseCalculo: number;
      aliquota: number;
      valor: number;
    };
    pis: {
      cst: string;
      baseCalculo: number;
      aliquota: number;
      valor: number;
    };
    cofins: {
      cst: string;
      baseCalculo: number;
      aliquota: number;
      valor: number;
    };
  };
}

export interface INFeDados {
  identificacao: {
    naturezaOperacao: string;
    serie: string;
    numero: string;
    dataEmissao: string;
    dataEntradaSaida: string;
    tipoDocumento: string;
    identificadorDestino: string;
    codigoMunicipio: string;
    tipoImpressao: string;
    tipoEmissao: string;
    ambiente: string;
    finalidade: string;
    operacaoConsumidorFinal: string;
    indicadorPresenca: string;
  };
  emitente: {
    cnpj: string;
    inscricaoEstadual: string;
    nome: string;
    nomeFantasia: string;
    endereco: {
      logradouro: string;
      numero: string;
      complemento?: string;
      bairro: string;
      codigoMunicipio: string;
      municipio: string;
      uf: string;
      cep: string;
      pais: string;
      codigoPais: string;
    };
  };
  destinatario: IDestinatario;
  produtos: IProduto[];
  total: {
    icmsBase: number;
    icmsValor: number;
    valorProdutos: number;
    valorNota: number;
  };

}

export interface INFeCancelamentoDados {
  evento:  {
    idLote: string;
    cOrgao: string;
    cnpj: string;
    chaveNFe: string;
    dataHoraEvento: string;
    tipoEvento: string;
    numeroSequencialEvento: string;
    versaoEvento: string;
    numeroProtocolo: string;
    justificativa: string;
  }
}