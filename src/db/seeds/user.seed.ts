import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import gDB from '../../InitDataSource'
import { UserEntity } from '../../entity/User.entity'

export class UserSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const db = gDB.getRepository(UserEntity)
    try {
      console.log('Factory instance:', factory(UserEntity)())
      const users = factory(UserEntity)()
        .map(async (user) => {
          console.log(user)
          await db.save(user)
          return user
        })
        .createMany(10)
      console.log('Users have been created:', users)
    } catch (e) {
      console.error('Error during seeding:', e)
    }
  }
}
