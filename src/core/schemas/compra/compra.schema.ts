import { z } from 'zod'
import { FormasPagamentoEnum } from '@/core/enums/formas-pagamento.enum'

export const compraSchema = z
  .object({
    nome: z
      .string({ required_error: 'O nome da compra é obrigatório.' })
      .nonempty({ message: 'O nome da compra é obrigatório.' })
      .max(100, { message: 'O nome da compra não pode ter mais de 100 caracteres.' })
      .min(3, { message: 'O nome da compra deve ter pelo menos 3 caracteres.' }),
    idCategoria: z
      .number({ required_error: 'A categoria da compra é obrigatória.' })
      .refine((value) => value > 0, {
        message: 'A categoria da compra deve ser selecionada.',
      }),
    valorTotal: z
      .number({ required_error: 'O valor total da compra é obrigatório.' })
      .nonnegative({ message: 'O valor total da compra não pode ser negativo.' })
      .refine((value) => value > 0, {
        message: 'O valor total da compra deve ser maior que zero.',
      }),
    formaPagamento: z
      .string({ required_error: 'A forma de pagamento é obrigatória.' })
      .nonempty({ message: 'A forma de pagamento é obrigatória.' })
      .refine(
        (value) =>
          Object.values(FormasPagamentoEnum).includes(value as FormasPagamentoEnum),
        {
          message: 'A forma de pagamento selecionada é inválida.',
        }
      ),

    qtdParcelas: z
      .number({ required_error: 'A quantidade de parcelas é obrigatória.' })
      .refine((value) => value > 0, {
        message: 'A quantidade de parcelas deve ser maior que zero.',
      })
      .nullable(),
    // taxaJuros: z.number({ required_error: 'A taxa de juros é obrigatória.' }).nullable(),
    // valorParcela: z.number().nullable(),
    // jurosTotais: z.number().nullable(),
    // valorTotalAVista: z.number().nullable().optional(),

    // dataPrimeiraParcela: z
    //   .date({
    //     required_error: 'A data de vencimento da primeira parcela é obrigatória.',
    //   })
    //   .nullable(),
    dataRealizacao: z.union([
      z.date({ required_error: 'A data de compra é obrigatória.' }),
      z.string().transform((str) => new Date(str))
    ]),
    lojaOuFornecedor: z
      .string({ required_error: 'O nome da loja ou fornecedor é obrigatório.' })
      .nonempty({ message: 'O nome da loja ou fornecedor é obrigatório.' })
      .max(100, {
        message: 'O nome da loja ou fornecedor não pode ter mais de 100 caracteres.',
      })
      .min(2, {
        message: 'O nome da loja ou fornecedor deve ter pelo menos 2 caracteres.',
      }),
    observacao: z
      .string()
      .max(500, { message: 'A observação não pode ter mais de 500 caracteres.' })
      .optional(),
    
    // Campos do cartão (condicionais quando formaPagamento é CREDITO)
    idCartao: z
      .number()
      .nullable()
      .optional(),
    nomeCartao: z
      .string()
      .max(100, { message: 'O nome do cartão não pode ter mais de 100 caracteres.' })
      .optional()
      .nullable(),
    diaVencimentoFatura: z
      .number()
      .int()
      .min(1, { message: 'O dia de vencimento deve ser entre 1 e 31.' })
      .max(31, { message: 'O dia de vencimento deve ser entre 1 e 31.' })
      .nullable()
      .optional(),
    diaFechamentoFatura: z
      .number()
      .int()
      .min(1, { message: 'O dia de fechamento deve ser entre 1 e 31.' })
      .max(31, { message: 'O dia de fechamento deve ser entre 1 e 31.' })
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Validações apenas quando a forma de pagamento for Cartão de Crédito
    if (data.formaPagamento === 'CREDITO') {
      // Quantidade de parcelas é obrigatória para cartão de crédito
      if (data.qtdParcelas == null || data.qtdParcelas <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A quantidade de parcelas deve ser maior que zero quando a forma de pagamento é Cartão de Crédito.',
          path: ['qtdParcelas'],
        })
      }

      // Cartão é obrigatório apenas quando forma de pagamento é CREDITO
      // O componente DetalhesCartao só aparece quando formaPagamento === 'CREDITO'
      if (data.idCartao == null || data.idCartao <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'O cartão deve ser selecionado quando a forma de pagamento é Cartão de Crédito.',
          path: ['idCartao'],
        })
      }

      // Validação condicional: se algum campo de cadastro foi preenchido, todos devem estar preenchidos
      const nomeCartaoPreenchido = data.nomeCartao != null && data.nomeCartao.trim() !== ''
      const diaVencimentoPreenchida = data.diaVencimentoFatura != null
      const diaFechamentoPreenchida = data.diaFechamentoFatura != null
      
      const algumCampoCadastroPreenchido = nomeCartaoPreenchido || diaVencimentoPreenchida || diaFechamentoPreenchida
      
      if (algumCampoCadastroPreenchido) {
        if (!nomeCartaoPreenchido) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'O nome do cartão é obrigatório ao cadastrar um novo cartão.',
            path: ['nomeCartao'],
          })
        }
        if (!diaVencimentoPreenchida) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'O dia de vencimento da fatura é obrigatório ao cadastrar um novo cartão.',
            path: ['diaVencimentoFatura'],
          })
        }
        if (!diaFechamentoPreenchida) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'O dia de fechamento da fatura é obrigatório ao cadastrar um novo cartão.',
            path: ['diaFechamentoFatura'],
          })
        }
      }

      // if (data.dataPrimeiraParcela == null) {
      //   ctx.addIssue({
      //     code: z.ZodIssueCode.custom,
      //     message: 'A data de vencimento da primeira parcela deve ser preenchida.',
      //     path: ['dataPrimeiraParcela'],
      //   })
      // }
    }
  })
