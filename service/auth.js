const sessionIdToUserMap = new Map()

function setUser (id, user) {
  sessionIdToUserMap.set(id, user)
}

function getUser(id) {
  return seesionIdToUserMap.get(id)
}

module.exports = {
  setUser,
  getUser,
}