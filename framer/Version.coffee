# This gets automatically populated bij gulp

exports.date = "<%= date %>"
exports.branch = "<%= branch %>"
exports.hash = "<%= hash %>"
exports.build = "<%= build %>"
exports.version = "#{exports.branch}/#{exports.hash}"