const success = (res, data) => {
  res.status(200).json({
    success: true,
    data: data,
  });
};

const error = (res, status = 500, code = 0, desc = 'internal server error') => {
  res.status(status).json({
    success: false,
    error: {
      code,
      desc,
    },
  });
};

export default {success, error};
