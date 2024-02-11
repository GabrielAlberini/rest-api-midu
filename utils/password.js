const hashPassword = async (pass) => {
  return Buffer.from(pass, 'utf-8').toString('base64')
}

export { hashPassword }
