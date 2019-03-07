let azureCredentials = {};
let azureCompute = {};
let azureStorage = {};

module.exports.getAzureCredentials = () => {
    return azureCredentials;
};

module.exports.setAzureCredentials = (creds) => {
    azureCredentials = creds;
};

module.exports.getAzureStorage = () => {
    return azureStorage;
};

module.exports.setAzureStorage = (storage) => {
    azureStorage = storage;
};

module.exports.getAzureCompute = () => {
    return azureCompute;
};

module.exports.setAzureCompute = (compute) => {
    azureCompute = compute;
};