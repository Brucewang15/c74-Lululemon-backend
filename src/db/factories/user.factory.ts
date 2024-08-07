import { define } from 'typeorm-seeding'
import { UserEntity } from '../../entity/User.entity'
import * as faker from '@faker-js/faker'

define(UserEntity, (faker): UserEntity => {
  let user = new UserEntity()
  user.firstName = faker.name.firstName()
  user.lastName = faker.name.lastName()
  user.gender = faker.name.gender(true)
  user.email = faker.internet.email({
    firstName: user.firstName,
    lastName: user.lastName,
  })
  user.password = faker.internet.password({ length: 8, memorable: true })
  user.age = faker.number.int({ min: 2, max: 100 })
  console.log('Defined user ==>', user)
  return user
})
