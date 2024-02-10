import bcrypt from 'bcryptjs';

export const encryptPassword = async (password: string) => {
  const encryptedPassword = await bcrypt.hash(password, 8);
  return encryptedPassword;
};

export const isPasswordMatch = async (password: string, staffPassword: string) => {
  return bcrypt.compare(password, staffPassword);
};
