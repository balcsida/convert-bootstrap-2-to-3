var re = require('./regex');
var base = require('./base');

var A = base.A;
var iterateLines = base.iterateLines;
var log = base.log;

var getRegExp = re.getRegExp;

var PREFIX_LINE_NUM = base.PREFIX_LINE_NUM;

module.exports = function(content) {
	var classNameConvertMap = re.MAP_CLASS_NAMES_CONVERT_CSS;

	content = iterateLines(
		content,
		function(item, index, collection) {
			var regexCssClass = getRegExp('(\\.)([a-zA-Z][a-zA-Z0-9-.]+)', 'g');

			if (regexCssClass.test(item)) {
				var lineNum = index + 1;

				item = item.replace(regexCssClass, function(m, $1, $2) {
					var className = $2;

					A.Object.each(
						classNameConvertMap,
						function(item, index, collection) {
							var reg = getRegExp('^' + index + '$', 'g');

							if (reg.test($2)) {
								className = className.replace(reg, item);
							}
						}
					);

					A.Object.each(
						re.MAP_REGEX_CLASS_NAMES_CONVERT_CSS,
						function(item, index, collection) {
							var reg = getRegExp(index, 'g');

							var matchRule = reg.test(className);

							if (matchRule) {
								className = className.replace(reg, item);
							}
						}
					);

					if ($2 in classNameConvertMap) {
						className = classNameConvertMap[$2];
					}

					if (className != $2) {
						log(PREFIX_LINE_NUM, lineNum, A.Lang.sub('changed {0} to {1}', [$2, className]));
					}

					return $1 + className;
				});
			}

			return item;
		}
	);

	return content;
};