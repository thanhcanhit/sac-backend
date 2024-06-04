import { ObjectId } from "mongoose";
import Token, { IToken } from "../models/Token";

class TokenController {
  public async getTokenOfUser(user_id: ObjectId): Promise<IToken | null> {
    try {
      const token = await Token.findOne({ user_id });

      return token;
    } catch (err) {
      return null;
    }
  }

  public async createToken(user_id: ObjectId, token: string): Promise<boolean> {
    try {
      // delete all old tokens of user
      await Token.deleteMany({ user_id });

      const newToken = new Token({ user_id, value: token });
      await newToken.save();

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public async isValidToken(
    user_id: ObjectId,
    token: string,
  ): Promise<boolean> {
    try {
      const tokenObj = await Token.findOne({ user_id, token });
      if (!tokenObj) return false;
      if (tokenObj.isUsed) return false;
    } catch (err) {
      return false;
    }

    return true;
  }
}

export default TokenController;
