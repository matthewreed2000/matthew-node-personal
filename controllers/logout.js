function run(req, res) {
  req.session.username = null;
  req.session.password = null;
  res.writeHead(302, {
    'Location': '/'
  });
  res.end();
}

module.exports = {run};