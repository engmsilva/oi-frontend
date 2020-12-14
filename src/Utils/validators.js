export const validaCNPJ = value => {
  if (!value) return false

  // Aceita receber o valor como string, número ou array com todos os dígitos
  const validTypes = typeof value === 'string' || Number.isInteger(value) || Array.isArray(value)

  // Elimina valor em formato inválido
  if (!validTypes) return false

  // Guarda um array com todos os dígitos do valor
  const match = value.toString().match(/\d/g)
  const numbers = Array.isArray(match) ? match.map(Number) : []

  // Valida a quantidade de dígitos
  if (numbers.length !== 14) return false

  // Elimina inválidos com todos os dígitos iguais
  const items = [...new Set(numbers)]
  if (items.length === 1) return false

  // Cálculo validador
  const calc = x => {
    const slice = numbers.slice(0, x)
    let factor = x - 7
    let sum = 0

    for (let i = x; i >= 1; i -= 1) {
      const n = slice[x - i]
      // eslint-disable-next-line
      sum += n * factor--
      if (factor < 2) factor = 9
    }

    const result = 11 - (sum % 11)

    return result > 9 ? 0 : result
  }

  // Separa os 2 últimos dígitos de verificadores
  const digits = numbers.slice(12)

  // Valida 1o. dígito verificador
  const digit0 = calc(12)
  if (digit0 !== digits[0]) return false

  // Valida 2o. dígito verificador
  const digit1 = calc(13)
  return digit1 === digits[1]

  // Referência: https://pt.wikipedia.org/wiki/Cadastro_Nacional_da_Pessoa_Jur%C3%ADdica}
}

export const validaCPF = value => {
  let Soma
  let Resto
  Soma = 0
  let i
  if (value === '00000000000') return false

  // eslint-disable-next-line
  for (i = 1; i <= 9; i += 1) Soma += parseInt(value.substring(i - 1, i)) * (11 - i)
  Resto = (Soma * 10) % 11

  if (Resto === 10 || Resto === 11) Resto = 0
  // eslint-disable-next-line
  if (Resto !== parseInt(value.substring(9, 10))) return false

  Soma = 0
  // eslint-disable-next-line
  for (i = 1; i <= 10; i += 1) Soma += parseInt(value.substring(i - 1, i)) * (12 - i)
  Resto = (Soma * 10) % 11

  // eslint-disable-next-line
  if (Resto === 10 || Resto === 11) Resto = 0
  // eslint-disable-next-line
  if (Resto !== parseInt(value.substring(10, 11))) return false
  return true
}
