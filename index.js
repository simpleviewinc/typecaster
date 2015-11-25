// umd boilerplate for CommonJS and AMD
if (typeof exports === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var defaults = {
		any : {
			name : "any",
			handler : function(data, type) {
				return data;
			}
		},
		boolean : {
			name : "boolean",
			handler : function(data, type) {
				if (typeof data === "boolean") {
					return data;
				}
				
				if (["1", 1, "0", 0, "yes", "no", "true", "false"].indexOf(data) === -1) {
					// ensure boolean is "true" or "false"
					throw new Error("Cannot convert '" + data + "' to boolean, it must be 'true' or 'false'");
				}
				
				return data === "true" || data === "1" || data === 1 || data === "yes";
			}
		},
		date : {
			name : "date",
			handler : function(data, type) {
				if (data instanceof Date) {
					return data;
				}
				
				if (typeof data === "string" && data.match(/^[\d]+$/)) {
					// handles Unix Offset passed in string
					data = parseInt(data, 10);
				}
				
				var temp = new Date(data);
				if (isNaN(temp)) {
					throw new Error("Cannot convert '" + data + "' to date, it's value is not valid in a JS new Date() constructor");
				}
				
				return temp;
			}
		},
		number : {
			name : "number",
			handler : function(data, type) {
				if (typeof data === "number") {
					return data;
				}
				
				var temp = Number(data);
				if (isNaN(temp)) {
					throw new Error("Cannot convert '" + data + "' to number, it's value is not a valid number");
				}
				
				return temp;
			}
		},
		string : {
			name : "string",
			handler : function(data, type) {
				if (typeof data === "string") {
					return data;
				}
				
				return data.toString();
			}
		}
	}
	
	var TypeCaster = function(args) {
		var self = this;
		
		args = args || {};
		
		self._locked = false;
		self._types = {};
		self._defaultTypes = args.defaultTypes || ["any", "boolean", "date", "number", "string"];
		
		self._defaultTypes.forEach(function(val, i) {
			self.addType(defaults[val]);
		});
	}
	
	TypeCaster.prototype.addType = function(args) {
		var self = this;
		
		if (self._locked === true) {
			throw new Error("TypeCaster locked, unable to add new types");
		}
		
		self._types[args.name] = args;
	}
	
	TypeCaster.prototype.lock = function() {
		var self = this;
		
		self._locked = true;
	}
	
	TypeCaster.prototype.convert = function(data, type) {
		var self = this;
		
		if (data === undefined) {
			return;
		}
		
		var caster = self._types[type];
		if (caster === undefined) {
			throw new Error("Cannot convert, '" + type + "' is not a supported conversion type");
		}
		
		return caster.handler(data, type);
	}
	
	var defaultCaster = new TypeCaster();
	defaultCaster.lock();
	
	module.exports = {
		TypeCaster : TypeCaster,
		convert : defaultCaster.convert.bind(defaultCaster)
	}
});