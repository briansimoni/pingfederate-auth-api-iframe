process.env.NODE_TLS_REJECT_UNAUTHORIZED=0;

const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();

app.use(urlencodedParser);
app.use(cookieParser())

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.post('/browser-side-login', (req, res) => {
  const { username, password, flowId } = req.body;
  res.render('browser-side-login', {
    username,
    password,
    flowId
  });
})


app.post('/server-side-login', (req, res) => {
  // res.json({
  //   cookie: req.headers.cookie,
  //   body: req.body,
  // })

  const { username, password, flowId } = req.body;
  
  getFlowIdResponse(flowId, req.headers.cookie)
  .then((response) => {
    return response;
  })
  .then((response) => {
    return checkUsernameAndPassword(username, password, flowId, response.cookieHeader);
  })
  .then((response) => {
    console.log(response);
    if (response.json.resumeUrl) {
      // res.set('set-cookie', response.setCookieHeader);
      res.redirect(response.json.resumeUrl);
      return;
    }
    res.send(response);
  })
  .catch((err) => {
    res.send(err.message);
  })
  .finally((thing) => {
    res.send(thing);
  })
})

const server = https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
}, app);

server.listen(8443, '0.0.0.0', () => {
  console.log('mycfrmportal.gecompany.com listening on 8443');
});

async function getFlowIdResponse(flowId, cookieHeader) {
  const response = await fetch('https://fss.gecompany.com:9031/pf-ws/authn/flows/' + flowId, {
    headers: {
      'X-XSRF-Header': 'PingFederate',
      cookie: cookieHeader
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new error('something went wrong in getFlowID Response ' + text);
  }

  const json = await response.json();

  let newCookieHeader;
  for (const header of response.headers) {
    if (header[0] === 'set-cookie') {
      newCookieHeader = header[1].match(/(PF=[a-zA-Z0-9]+);/)[1]
    }
    // console.log(`Name: ${header[0]}, Value:${header[1]}`);
  }

  return {
    json,
    cookieHeader: newCookieHeader
  }
}

async function checkUsernameAndPassword(username, password, flowId, cookieHeader) {
  const response = await fetch('https://fss.gecompany.com:9031/pf-ws/authn/flows/' + flowId, {
    method: 'POST',
    headers: {
      cookie: cookieHeader,
      'Content-Type': 'application/vnd.pingidentity.checkUsernamePassword+json',
      'X-XSRF-Header': 'custom-app'
    },
    body: JSON.stringify({
      username,
      password
    })
  })

  if (!response.ok) {
    const text = await response.text();
    throw new Error('something went wrong with validate password ' + text);
  }

  let setCookieHeader;
  for (const header of response.headers) {
    if (header[0] === 'set-cookie') {
      setCookieHeader = header[1];
      console.log('final cookie', header[1]);
    }
    // console.log(`Name: ${header[0]}, Value:${header[1]}`);
  }

  const json = await response.json();

  return {
    json,
    setCookieHeader,
  }
}

