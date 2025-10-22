import { z } from 'zod'

export const calendarioSchema = z.object({
  nome: z
    .string({ required_error: 'O nome é obrigatório.' })
    .nonempty({ message: 'O nome é obrigatório.' })
    .max(100, { message: 'É obrigatório ter menos de 100 caracteres.' })
    .min(3, { message: 'É obrigatório ter pelo menos 3 caracteres.' }),
  criarCategoriaPadrao: z.boolean().default(true).optional(),
})
