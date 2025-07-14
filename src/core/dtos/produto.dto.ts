export interface IProduto {
  idProduto: number
  descricao: string
  idCategoriaCompra: number
  valorTotal: number
  valorTotalAVista?: number
  dataRealizacao: Date
  formaPagamento: string
  qtdParcelas: number
  taxaJuros: number
  valorParcela: number
  jurosTotais: number
  dataPrimeiraParcela: Date
  lojaOuFornecedor: string
  observacao?: string
}
export class Produto implements IProduto {
  idCategoriaCompra!: number
  formaPagamento!: string
  qtdParcelas!: number
  taxaJuros!: number
  valorParcela!: number
  jurosTotais!: number
  dataPrimeiraParcela!: Date
  lojaOuFornecedor!: string
  idProduto!: number
  descricao!: string
  valorTotal!: number
  valorTotalAVista?: number
  dataRealizacao!: Date
  observacao?: string
}
