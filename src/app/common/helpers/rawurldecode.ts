export function rawurldecode(str) {
  return decodeURIComponent((str + '')
    .replace(/%(?![\da-f]{2})/gi, function () {
      // PHP tolerates poorly formed escape sequences
      return '%25'
    }))
}
