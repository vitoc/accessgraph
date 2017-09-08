let azure = require('azure-storage');
let blob = {}

blob.service = azure.createBlobService(
    'STORNAME', 
    'STORKEY'
);

module.exports = blob;