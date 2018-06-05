module.exports = function materialize (node) {
  if (!node) {
    return node
  }
  if (node.view) {
    return materialize(node.view(node.attributes, node.children))
  }
  if (node.children) {
    node.children = node.children.map(materialize).filter((child) => child !== undefined && child !== null)
  }
  return node
}
