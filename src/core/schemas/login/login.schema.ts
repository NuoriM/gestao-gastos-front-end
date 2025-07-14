import { z } from 'zod';
import { isEmailOrPhone } from '@/core/utils/validators';

export const loginSchema = z.object({
  emailTelefone: z
    .string({
      required_error: 'O e-mail ou telefone que você inseriu não está vinculado a nenhuma conta.',
    })
    .refine(isEmailOrPhone, {
      message: 'Insira um e-mail ou telefone válido.',
    }),
  senha: z
    .string({ required_error: 'A senha inserida é inválida.' })
    .nonempty({ message: 'A senha inserida é inválida.' }),
})
