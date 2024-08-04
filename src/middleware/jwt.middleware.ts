import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { CLog } from '../AppHelper'

export const validateJwt = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers['token']
  if (!token) {
    // 没有token直接返回错误
    return res.status(400).send('Access denied')
  }
  let reJwt = null
  try {
    // 验证并解码JWT
    reJwt = jwt.verify(token, process.env.JWT_SECRET)
    CLog.info('jwt token verified', reJwt)
  } catch (e) {
    CLog.bad('jwt token verified', e)
    return res.status(400).send('invalid token')
  }
  //如果失败了直接return
  //如果成功了必须要调用next()
  // 所有middleware请求成功了必须加个next

  // 将解码后的JWT保存到响应的局部变量中
  res.locals.jwtPayload = reJwt
  // 继续传递请求
  next()
}
