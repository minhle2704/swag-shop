exports.generateTemporaryPassword = function () {
  const length = 12;
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let string = "";
  for (let i = 0; i <= length; i++) {
    const index = Math.floor(Math.random() * chars.length);
    string += chars[index];
  }
  return string;
};
