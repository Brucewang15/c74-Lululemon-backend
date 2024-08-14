// 20221020, Kevin Maas
// require('dotenv-flow').config({
//   path: path.resolve(__dirname, '../'), // 确保路径正确，指向包含 .env 文件的目录
// })
// console.log('Loaded DB_FILE:', process.env.DB_FILE) // 打印环境变量，检查是否正确加载
import { DataSource, DataSourceOptions } from 'typeorm'
import { CLog, CPath, gisProduction } from './AppHelper'
import * as path from 'path'

require('dotenv').config({
  path: path.resolve(__dirname, '../.env.development'),
})

if (!process.env.PORT) {
  require('dotenv-flow').config()
}

if (!process.env.DB_FILE) {
  CLog.bad(`Invalid or Missing [Primary] DB Config env, ${process.env.DB_FILE}`)
  process.exit(1)
}

// alert only
const entityPath =
    process.env.ENV === 'production'
        ? path.join(__dirname + '/../../build/src/auth2/entity/**/*.entity.js')
        : path.join(__dirname + '/../src/entity/**/*.entity.ts')
CLog.ok(`Env is: -->${process.env.NODE_ENV}`)

CLog.ok(`Server Path-->${__dirname}`)
CLog.ok(`Entity Path: -->${entityPath}`)
CLog.ok(`DB Info:
[Master]-->${process.env.DB_FILE}
`)

CLog.info(`Seed info: 
   ${process.env.TYPEORM_SEEDING_SEEDS} 
`)

const options: DataSourceOptions = {
  type: 'sqlite',
  ...{
    database: process.env.DB_FILE,
  },

  synchronize: process.env.DB_SYNC.toLowerCase() === 'true',
  extra: { connectionLimit: 50 },
  logging: ['error'],
  maxQueryExecutionTime: 3000, //logging query executing 1 second

  // "keepConnectionAlive":true,
  // "[__for typeORM seeding": null,

  // "__for typeORM seeding": null,
  entities: [
    entityPath,
    // path.join(__dirname, '../**/**.entity{.ts,.js}') : '**/*.entity{.ts,.js}'
  ],
  // migrations: [path.join(__dirname, '/../migration/*.ts')],
  migrations: ['src/migration/*.ts'],

  subscribers: [process.env.MYSQL_SUBSCRIBERS],
  // seeds: [
  //     //process.env.TYPEORM_SEEDING_SEEDS
  //     // MainSeed
  // ],
  // "cli": {
  //     "entitiesDir": process.env.MYSQL_ENTITIESDIR,
  //     "migrationsDir": process.env.MYSQL_MIGRATIONSDIR,
  //     "subscribersDir": process.env.MYSQL_SUBSCRIBERSDIR
  // }
}
const gDB = new DataSource(options)

export default gDB
