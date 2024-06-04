import jwt from "jsonwebtoken";

class JsonWebToken {
  private static secretKey: string = process.env.PRIVATE_KEY || "secret";
  private static publicKey: string = process.env.PUBLIC_KEY || "public";

  static generatePrivateToken(payload: any) {
    return jwt.sign(payload, this.secretKey, { expiresIn: "180s" });
  }

  static generatePublicToken(payload: any) {
    return jwt.sign({ ...payload, isUsed: false }, this.publicKey, {
      expiresIn: "7d",
    });
  }

  static verifyPrivateToken(token: string) {
    return jwt.verify(token, this.secretKey);
  }
  static verifyPublicToken(token: string) {
    return jwt.verify(token, this.publicKey);
  }
}

export default JsonWebToken;
