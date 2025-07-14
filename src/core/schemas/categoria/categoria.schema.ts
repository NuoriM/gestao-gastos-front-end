import { z } from 'zod'

export const categoriaSchema = z.object({
  nome: z
    .string({ required_error: 'O nome da categoria é obrigatório.' })
    .nonempty({ message: 'O nome da categoria é obrigatório.' })
    .max(100, { message: 'O nome da categoria não pode ter mais de 100 caracteres.' })
    .min(3, { message: 'O nome da categoria deve ter pelo menos 3 caracteres.' }),
  corHex: z
    .string({ required_error: 'A cor da categoria é obrigatória.' })
    .nonempty({ message: 'A cor da categoria é obrigatória.' }),
  descricao: z.string().optional(),
})
