module.exports = () => {
  const date = Date.now().toString();
  const end = date.slice(9);
  const start = Math.random().toString(36).substring(2, 4).toUpperCase();
  return start + end;
};
