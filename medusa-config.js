const dotenv = require('dotenv')

let ENV_FILE_NAME = '';
switch (process.env.NODE_ENV) {
	case 'production':
		ENV_FILE_NAME = '.env.production';
		break;
	case 'staging':
		ENV_FILE_NAME = '.env.staging';
		break;
	case 'test':
		ENV_FILE_NAME = '.env.test';
		break;
	case 'development':
	default:
		ENV_FILE_NAME = '.env';
		break;
}

try {
	dotenv.config({ path: process.cwd() + '/' + ENV_FILE_NAME });
} catch (e) {
}

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_DATABASE = process.env.DB_DATABASE

const DATABASE_URL = 
  `postgres://${DB_USERNAME}:${DB_PASSWORD}` + 
  `@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`

// Medusa uses Redis, so this needs configuration as well
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Stripe keys
const STRIPE_API_KEY = process.env.STRIPE_API_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

const JWT_SECRET = process.env.JWT_SECRET
const COOKIE_SECRET = process.env.COOKIE_SECRET

// This is the place to include plugins. See API documentation for a thorough guide on plugins.
const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  // Uncomment to add Stripe support.
  // You can create a Stripe account via: https://stripe.com
  // {
  //   resolve: `medusa-payment-stripe`,
  //   options: {
  //     api_key: STRIPE_API_KEY,
  //     webhook_secret: STRIPE_WEBHOOK_SECRET,
  //   },
  // },
  {
    resolve: `medusa-plugin-algolia`,
    options: {
      application_id: process.env.ALGOLIA_APP_ID,
      admin_api_key: process.env.ALGOLIA_ADMIN_API_KEY,
      settings: {
        products: {
          searchableAttributes: ["title", "description"],
          attributesToRetrieve: [
            "id",
            "title",
            "description",
            "handle",
            "thumbnail",
            "variants",
            "variant_sku",
            "options",
            "collection_title",
            "collection_handle",
            "images",
          ],
        },
      },
    },
  },
  {
    resolve: `medusa-plugin-sendgrid`,
    options: {
      api_key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM,
      user_password_reset_template: process.env.SENDGRID_USER_PASSWORD_RESET_ID,
    },
  },
  {
    resolve: `medusa-file-spaces`,
    options: {
        spaces_url: process.env.SPACE_URL,
        bucket: process.env.SPACE_BUCKET,
        endpoint: process.env.SPACE_ENDPOINT,
        access_key_id: process.env.SPACE_ACCESS_KEY_ID,
        secret_access_key: process.env.SPACE_SECRET_ACCESS_KEY,
    },
  },
  // {
  //   resolve: `medusa-file-s3`,
  //   options: {
  //       s3_url: process.env.S3_URL,
  //       bucket: process.env.S3_BUCKET,
  //       region: process.env.S3_REGION,
  //       access_key_id: process.env.S3_ACCESS_KEY_ID,
  //       secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
  //   },
  // },
    {
    resolve: `medusa-plugin-segment`,
    options: {
      write_key: process.env.SEGMENT_WRITE_KEY,
    },
  },
];

module.exports = {
  projectConfig: {
    redis_url: REDIS_URL,
    // For more production-like environment install PostgresQL
    database_url: DATABASE_URL,
    database_type: "postgres",
    // database_database: "./medusa-db.sql",
    // database_type: "sqlite",
    database_extra: { ssl: { rejectUnauthorized: false } },
    jwt_secret: JWT_SECRET,
    cookie_secret: COOKIE_SECRET,
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
  },
  plugins,
};
