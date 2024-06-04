import bcrypt from "bcrypt";

class HashString {
  static async hash(value: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(value, salt);
  }

  static async compare(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }
}

export default HashString;
