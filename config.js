
exports.DATABASE_URL = process.env.DATABASE_URL ||
						process.env.MONGODB_URI ||
						process.env.MONGOHQ_URL ||
						process.env.MONGOLAB_URI ||
                      'mongodb://localhost/blogs-app';

exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                      'mongodb://localhost/test-blogs-app';
exports.PORT = process.env.PORT || 8080;
