import jwt from "jsonwebtoken";
export  function makeUnsubscribeToken(userId) {
  return jwt.sign(
    { userId, type: "unsubscribe" },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}
5
export async function  verifyUnsubscribeToken  (token)  {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // extra safety check
    if (decoded.type !== "unsubscribe") {
      throw new Error("Invalid token type");
    }

    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired unsubscribe token");
  }
};