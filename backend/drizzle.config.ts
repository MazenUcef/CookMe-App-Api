export default{
    schema: './src//modals//Schema.ts',
    dialect: 'postgresql',
    out: './src/utils/migrations',
    dbCredentials: {
        url: process.env.DATABASE_URL || ''
    }
}