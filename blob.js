let azure = require('azure-storage');
let blob = {}

blob.service = azure.createBlobService(
    'vstortest', 
    '2c/T0hid9wNW7tvs0phM/AmTrAh8ZxE/Bp5mv8ydp1dpg55FgX8qcm443W1bdejPBE88iXcHi1YCqPwSH2I7CA=='
);

module.exports = blob;