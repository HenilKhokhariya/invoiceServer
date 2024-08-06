const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (err) {
    console.log(err);

    res.status(500).json({ status: false, message: err.errors[0].message });
  }
};

module.exports = validate;
