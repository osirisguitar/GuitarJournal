var crypto = require('crypto');

module.exports = {
	createPasswordHash: function(password) {
		var hash = crypto.createHash('md5');

		var preSalt = process.env.PRESALT;
		var postSalt = process.env.POSTSALT;
		hash.update(preSalt + password + postSalt);
		var digest = hash.digest('hex');

		return digest;
	},

	verifyPasswordHash: function(password, passwordHash) {
		var digest = this.createPasswordHash(password);

		return digest === passwordHash;
	}
};