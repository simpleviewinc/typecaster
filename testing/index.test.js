var typecaster = require("../index.js");
var assert = require("assert");

describe(__filename, function() {
	describe("types", function() {
		var tests = [
			["string to any", "5", "any", "5"],
			["'true' to boolean", "true", "boolean", true],
			["'false' to boolean", "false", "boolean", false],
			["false to boolean", false, "boolean", false],
			["true to boolean", true, "boolean", true],
			["'1' to boolean", "1", "boolean", true],
			["'0' to boolean", "0", "boolean", false],
			["1 to boolean", 1, "boolean", true],
			["0 to boolean", 0, "boolean", false],
			["'string' to string", "string", "string", "string"],
			["5 to string", 5, "string", "5"],
			["true to string", true, "string", "true"],
			["date to string", new Date(2000, 1, 2), "string", "Wed Feb 02 2000 00:00:00 GMT+0000 (UTC)"],
			["iso to date", "2000-02-02T00:00:00.000Z", "date", new Date(2000, 1, 2)],
			["'unix' to date", "949460645006", "date", new Date(2000, 1, 2, 3, 4, 5, 6)],
			["unix to date", 949460645006, "date", new Date(2000, 1, 2, 3, 4, 5, 6)],
			["date to date", new Date(2000, 1, 2), "date", new Date(2000, 1, 2)],
			["'10' to number", "10", "number", 10],
			["10 to number", 10, "number", 10]
		]
		
		tests.forEach(function(val, i) {
			it(val[0], function() {
				var value = typecaster.convert(val[1], val[2]);
				
				if (val[3] instanceof Date) {
					assert.strictEqual(value instanceof Date, true);
					assert.strictEqual(value.toISOString(), val[3].toISOString());
				} else {
					assert.strictEqual(value, val[3]);
				}
			});
		});
	});
	
	it("should lock", function() {
		var caster = new typecaster.TypeCaster();
		caster.lock();
		
		assert.throws(function() {
			caster.addType()
		}, /TypeCaster locked, unable to add new types/);
	});
	
	it("should init with default types", function() {
		var caster = new typecaster.TypeCaster();
		assert.deepEqual(Object.keys(caster._types), ["any", "boolean", "date", "number", "string"]);
		
		var caster = new typecaster.TypeCaster({ defaultTypes : ["any"] });
		assert.deepEqual(Object.keys(caster._types), ["any"]);
	});
	
	it("should error on attempting invalid type", function() {
		assert.throws(function() {
			typecaster.convert("something", "bogus");
		}, /Cannot convert, 'bogus' is not a supported conversion type/);
	});
});