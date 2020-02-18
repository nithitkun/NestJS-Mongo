const isProd = process.env.Prod === 'true';
export const AppEnvironment = {
    dbHost : isProd ? 'mongodb://mongo/member_db' : 'mongodb://localhost/member_db'
};