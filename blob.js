let azure = require('azure-storage');
let blob = {}

blob.service = azure.createBlobService(
    'STORNAME', 
    'STORKEY'
);

blob.getSharedAccessPolicy = function () {
    let startDate = new Date();
    let expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 100);
    startDate.setMinutes(startDate.getMinutes() - 100);

    let sharedAccessPolicy = {
        AccessPolicy: {
        Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
        Start: startDate,
        Expiry: expiryDate
        }
    };

    return sharedAccessPolicy;
}

module.exports = blob;