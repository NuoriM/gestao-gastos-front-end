import { z } from 'zod'

export const compraSchema = z
  .object({
    descricao: z
      .string({ required_error: 'A descricao da compra é obrigatório.' })
      .nonempty({ message: 'A descricao da compra é obrigatório.' })
      .max(100, { message: 'A descricao da compra não pode ter mais de 100 caracteres.' })
      .min(3, { message: 'A descricao da compra deve ter pelo menos 3 caracteres.' }),
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
      .nonempty({ message: 'A forma de pagamento é obrigatória.' }),

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
  })
  .superRefine((data, ctx) => {
    if (data.formaPagamento === 'CREDITO') {
      if (data.qtdParcelas == null || data.qtdParcelas <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A quantidade de parcelas deve ser maior que zero.',
          path: ['qtdParcelas'],
        })
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
