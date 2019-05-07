import config from '../../../config'
import moment from 'moment-timezone'
import hash from 'hash.js'
import jwt from 'jsonwebtoken'
import shortid from 'shortid'
import _ from 'lodash'

var responses = {
  TYPE_INCORRECT: "device type not match.",
  KEY_NOT_MATCHED: "API key not match.",
  KEY_INVALID: "API key invalid.",
};

// var hat = require('hat');
var uuid = require('node-uuid');

import Organization from '../../models/organization';
import apiKeyObject from '../../models/apiKey';

//Test
const test = (req, res) => {
  console.warn("/test");
  var value = {
    "success": true,
    "message": "API works"
  };
  var apiKey = uuid.v4();
  console.log(apiKey);
  return res.status(200).send(value);
}

// https://github.com/chronosis/uuid-apikey
const generateAPIKey = (req, res, next) => {
  var myType = req.headers['type'];
  var orgName = req.headers['organization'];
  if( myType === "android") {
    saveApiKeyAndroid(res, req.body, myType, orgName, Organization);
  } else if (myType === "ios" ) {
    saveApiKeyIOS(res, req.body, myType, orgName, Organization);
  } else {
    return res.status(501).send({
      "data": myType,
      "success": false,
      "message": responses.TYPE_INCORRECT
    });
  }
}

const verifyKey = (req, res, next) => {
  // var orgName = req.headers['organization'];
  // var appName = req.body.appName;
  // var pkgName = req.body.pkgName;
  var apiKey = req.body.apiKey;
  var query = {
    apiKey: apiKey
  };
  apiKeyObject.findOne(query, function(err, docs){
    if(err){
      return res.status(501).send({
                "success": false,
                "message": "API key not found"
              });
    }
    if(docs !== null){
      console.log(docs);
      var meta = {};
      meta['appName'] = docs.appName;
      meta['orgId'] = docs.orgId;
      return res.status(200).send({
                  "success": true,
                  "validate": true,
                  "meta" : meta,
                });
    }
  });
}

const orgInit = (req, res, next) => {
  var orgName = req.headers['organization'];
  var orgData = {};
  orgData['orgName'] = orgName;
  orgData['createdAt'] = new Date();

  var newOrganization = new Organization(orgData);
  newOrganization.save(function (err) {
    if (err) {
      orgData['status'] = "failed";
      console.log(orgData);
      return res.status(501).send({
        "status": false,
        "message": "organization not created",
        "Error": err
      })
    }
    var _id = newOrganization.id;
    orgData['status'] = "success";
    console.log(orgData);
    // console.log(_id);
    return res.status(200).send({
      "status": true,
      "_id" : _id,
      "message": "organization created"
    });
  });
}

var saveApiKeyAndroid = (res, body, type, orgName, organizationModel) => {
  var data = {};
  data['type'] = type;
  data['appName'] = body.appName;
  data['pkgName'] = body.pkgName;
  data['SHA1_fingerprint'] = body.sha1;
  data['createdAt'] = new Date();
  var apiKey = uuid.v4();
  data['apiKey'] = apiKey;
  var query = {
    orgName: orgName
  };
  var q = {
    appName : body.appName,
    pkgName : body.pkgName
  };

  apiKeyObject.findOne(q, function(err, doc){
    // console.log(doc);
    if(doc){
      return res.status(501).send({
        "status": false,
        "message": "Duplicate package name"
      });
    } else {
      organizationModel.findOne(query, function (err, docs) {
        if (docs === null) {
          return res.status(501).send({
            "status": false,
            "message": "organization not found"
          });
        } else {
          // console.log(docs._id);
          data['orgId'] = docs._id;
          var newAPIKey = new apiKeyObject(data);
          newAPIKey.save(function (err) {
            if (err) {
              return res.status(501).send({
                "status": false,
                "message": "API key is not created",
                "Error": err
              })
            }
            var id = newAPIKey.apiKey;
            // console.log(_id);
            return res.status(200).send({
              "status": true,
              "apiKey" : id,
              "message": "API key created"
            });
          });
        }
      });
    }
  });
}

var saveApiKeyIOS = (res, body, type, orgName, organizationModel) => {
  var data = {};
  data['type'] = type;
  data['appName'] = body.appName;
  data['bundleIdentifier'] = body.bundleIdentifier;
  data['createdAt'] = new Date();
  var apiKey = uuid.v4();
  data['apiKey'] = apiKey;
  var query = {
    orgName: orgName
  };

  var q = {
    appName : body.appName,
    bundleIdentifier : body.bundleIdentifier
  };

  apiKeyObject.findOne(q, function(err, doc){
    // console.log(doc);
    if(doc){
      return res.status(501).send({
        "status": false,
        "message": "Duplicate package name"
      });
    } else {
      organizationModel.findOne(query, function (err, docs) {
        if (docs === null) {
          return res.status(501).send({
            "status": false,
            "message": "organization not found"
          });
        } else {
          // console.log(docs._id);
          data['orgId'] = docs._id;
          var newAPIKey = new apiKeyObject(data);
          newAPIKey.save(function (err) {
            if (err) {
              return res.status(501).send({
                "status": false,
                "message": "API key is not created",
                "Error": err
              })
            }
            var id = newAPIKey.apiKey;
            // console.log(_id);
            return res.status(200).send({
              "status": true,
              "apiKey" : id,
              "message": "API key created"
            });
          });
        }
      });
    }
  });
}

function checkType(t) {
  var types = ["ios", "android", "http"];
  var ret = types.includes(t);
  // console.log(ret);
  var promise = new Promise(function (resolve, reject) {
    if (ret === true) {
      resolve(ret);
    } else {
      reject(ret);
    }
  });
  return promise;
}

const HandShake = (req, res, next) => {
  // var org = req.headers['organization'];
  // var appName = req.body.appName;
  var apiKey = req.body.apiKey;
  // console.log(apiKey);
  var query = {
    // orgName: org,
    // appName: appName,
    apiKey : apiKey,
  };

  apiKeyObject.findOne(
    query,
    (err, data) => {
      if(err || data===null) {
        return res.status(401).send({
          "success": false,
          "description": responses.KEY_INVALID
        });
      }
      else {
        // console.log(data);
        if(data.apiKey === apiKey){
          const token = jwt.sign({apiKey: apiKey}, config.base.jwt, {expiresIn: '7d'});
          const meta = {};
          return res.status(200).send({
            "token": token,
            "expiresIn" : '7d',
            "meta" : meta,
          });
        }
      }
    }
  );
}

module.exports = {
  test: test,
  generate: generateAPIKey,
  verify: verifyKey,
  orgInit: orgInit,
  handshake: HandShake,
}