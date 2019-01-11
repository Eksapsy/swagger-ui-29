const jsonrefs = require('json-refs');
const fs = require('fs');
const yaml = require('js-yaml');

let yamlPath = './api/index.yaml';

const options = {
    filter: ['relative', 'remote'],
    resolveCirculars: true,
    loaderOptions: {
        processContent: (res, callback) => {
            callback(undefined, yaml.safeLoad(res.text));
        }
    }
};

/**
 * The following code is for parsing and de-referrencing JSON code
 * using the json-refs and js-yaml library
 */ 

// let root = JSON.parse(fs.readFileSync('./example.json', 'utf8'));

// jsonrefs.resolveRefs(root, options).then(results => {
//     console.log(JSON.stringify(results, '\t', 2));
// });

// jsonrefs.resolveRefs(root, options).then(function (results) {
//     var resErrors = {};
//     for (const [k,v] of Object.entries(results.refs)) {
//           if ('missing' in v && v.missing === true && (v.type == 'relative' || v.type === 'remote'))
//             resErrors[k] = v.error;
//         }
// 
//     if (Object.keys(resErrors).length > 0) {
//         console.log(resErrors);
//     }
// 
//     console.log(results.resolved);
//   }, function (e) {
//         var error = {};
//         Object.getOwnPropertyNames(e).forEach(function (key) {
//                 error[key] = e[key];
//               });
//       console.log(error)
// });

/**
 * The following code is for parsing and de-referrencing YAML code
 * using the json-refs and js-yaml library
 */ 

let rootYaml = yaml.safeLoad(fs.readFileSync(yamlPath, 'utf8'));

jsonrefs.resolveRefs(rootYaml, options).then(function (results) {
    var resErrors = {};
    for (const [k,v] of Object.entries(results.refs)) {
          if ('missing' in v && v.missing === true && (v.type == 'relative' || v.type === 'remote'))
            resErrors[k] = v.error;
        }

    if (Object.keys(resErrors).length > 0) {
        console.log(resErrors);
    }

    writeJsonObjectToFile(results);
  }, function (e) {
        var error = {};
        Object.getOwnPropertyNames(e).forEach(function (key) {
                error[key] = e[key];
              });
      console.log(error)
});

function writeJsonObjectToFile(json) {
    fs.writeFileSync('./mybundle.json', JSON.stringify(json, '\t', 2));
}