//header: x-admin
//value: admin
//check header "x-admin" trong req co bang value "admin" khong?

function authenticationAdmin(req, res, next) {
  try {
    const user = req.headers?.['x-admin'];

    if (!user || user !== 'admin') {
      return res.status(401).send({
        data: null,
        message: 'Not admin',
        success: false,
      });
    }
    console.log('pass');

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      data: null,
      message: 'Server error',
      success: false,
    });
  }
}

export { authenticationAdmin };
