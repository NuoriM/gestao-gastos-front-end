import type { ICategoria } from "./categoria.dto"
import type { ICartao } from "./cartao.dto"

export interface ICompra {
  idCompra?: number
  nome: string
  categoria?: ICategoria
  cartao?: ICartao
  valorTotal: number
  formaPagamento: string
  qtdParcelas: number
  dataRealizacao?: string | Date
  lojaOuFornecedor: string
  observacao?: string
}

export interface ICompraResponse extends Omit<ICompra, 'categoria' | 'cartao'> {
    categoria?: ICategoriaReferencia
    cartao?: ICartaoReferencia
}

export interface ICompraFormulario extends Omit<ICompra, 'categoria' | 'cartao'> {
    idCategoria?: number
    idCartao?: number
}

export interface ICartaoReferencia {
    idCartao: number
}

export interface ICategoriaReferencia {
    idCategoria: number
}
