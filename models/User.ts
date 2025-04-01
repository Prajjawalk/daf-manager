import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  state: String,
  codeVerifier: String,
  codeChallenge: String,
  accessToken: String,
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
