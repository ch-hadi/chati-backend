import jwt from "jsonwebtoken";
export const verifyUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).send({ success: false, message: "You are not authenticated!" });
  } else {
    jwt.verify(token.split(' ')[1], process.env.JWT_KEY, (err, user) => {
      if (err) {
        return res
          .status(403)
          .send({ success: false, message: "Token is not valid!" });
      }
      req.user = user;
      next();
    });
  }
};