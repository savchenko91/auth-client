import { User } from '@/types/entities'
import {
  REDUX_API_MIDDLEWARE as type,
  APIActionAlt,
} from '@savchenko91/rc-redux-api-mw'
import { OnStage } from '../types/transfer'
import CONSTANTS from './user.constants'

interface GetListParams {
  perPage: number
  currentPage: number
}

export function getList(
  params: GetListParams,
  onStage?: OnStage
): APIActionAlt {
  const skip = params.perPage * (params.currentPage - 1)
  return {
    url: `/api/v1/users?take=${params.perPage}&skip=${skip}`,
    method: 'get',
    stageActionTypes: CONSTANTS.GET_LIST,
    type,
    ...onStage,
  }
}

export function create(body: User, onStage?: OnStage): APIActionAlt {
  return {
    url: `/api/v1/users`,
    method: 'post',
    body,
    stageActionTypes: CONSTANTS.CREATE,
    type,
    ...onStage,
  }
}

export function update(body: User, onStage?: OnStage): APIActionAlt {
  return {
    url: `/api/v1/users`,
    method: 'PUT',
    body,
    stageActionTypes: CONSTANTS.UPDATE,
    type,
    ...onStage,
  }
}

export function pruneMany(body: number[], onStage?: OnStage): APIActionAlt {
  return {
    url: `/api/v1/users`,
    method: 'DELETE',
    body,
    stageActionTypes: CONSTANTS.PRUNE_MANY,
    type,
    ...onStage,
  }
}