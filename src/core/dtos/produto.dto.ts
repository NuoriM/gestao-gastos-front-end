export interface IProduto {
  idProduto: number
  descricao: string
  idCategoria: number
  valorTotalParcelado: number
  valorTotalAVista?: number
  dataCompra: Date
  formaPagamento: number
  qtdParcelas: number
  taxaJuros: number
  valorParcela: number
  jurosTotais: number
  dataVencimentoPrimeiraParcela: Date
  lojaOuFornecedor: string
  observacao?: string
}
export class Produto implements IProduto {
  idCategoria!: number
  formaPagamento!: number
  qtdParcelas!: number
  taxaJuros!: number
  valorParcela!: number
  jurosTotais!: number
  dataVencimentoPrimeiraParcela!: Date
  lojaOuFornecedor!: string
  idProduto!: number
  descricao!: string
  valorTotalParcelado!: number
  valorTotalAVista?: number
  dataCompra!: Date
  observacao?: string
}
