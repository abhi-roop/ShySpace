/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url:'postgresql://mock-interview_owner:AtHw1R9YzgZp@ep-shrill-wind-a5jfg62o.us-east-2.aws.neon.tech/mock-interview?sslmode=require',
    }
  };