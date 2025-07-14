import { z } from 'zod'
import { isEmailOrPhone } from '@/core/utils/validators'

export const registroSchema = z.object({
  nome: z
    .string({ required_error: 'O nome é obrigatório.' })
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
    .nonempty({ message: 'O nome é obrigatório.' }),
  sobrenome: z
    .string({ required_error: 'O sobrenome é obrigatório.' })
    .min(3, { message: 'O sobrenome deve ter pelo menos 3 caracteres.' })
    .nonempty({ message: 'O sobrenome é obrigatório.' }),
  emailTelefone: z
    .string({ required_error: 'O email ou telefone é obrigatório.' })
    .min(5, { message: 'O email ou telefone deve ter pelo menos 5 caracteres.' })
    .nonempty({ message: 'O email ou telefone é obrigatório.' })
    .refine(isEmailOrPhone, {
      message: 'Insira um e-mail ou telefone válido.',
    }),
  senha: z
    .string({ required_error: 'A senha que você inseriu está incorreta.' })
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
    .nonempty({ message: 'A senha que você inseriu está incorreta.' }),
})
