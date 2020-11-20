import validateAlias from '../../actions/dataset-alias/validateDatasetAliasName'

function listAliases(client) {
  return client.request({uri: '/aliases'})
}

function createAlias(client, name, datasetName) {
  return modify(client, 'PUT', name, datasetName ? {datasetName} : null)
}

function modify(client, method, name, body) {
  return client.request({method, uri: `/aliases/${name}`, body})
}

function updateAlias(client, name, datasetName) {
  return modify(client, 'PATCH', name, datasetName ? {datasetName} : null)
}

function unlinkAlias(client, name) {
  validateAlias(name)
  return modify(client, 'PATCH', `${name}/unlink`, {}, true)
}

function removeAlias(client, name) {
  return modify(client, 'DELETE', name)
}

exports.listAliases = listAliases
exports.createAlias = createAlias
exports.unlinkAlias = unlinkAlias
exports.updateAlias = updateAlias
exports.removeAlias = removeAlias
