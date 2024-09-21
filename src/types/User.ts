/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { DeleteUserData, GetUserDetailData } from './data-contracts';
import { HttpClient, RequestParams } from './http-client';

export class User<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags user-controller
   * @name GetUserDetail
   * @request GET:/user/detail
   * @secure
   * @response `200` `GetUserDetailData` OK
   */
  getUserDetail = (params: RequestParams = {}) =>
    this.request<GetUserDetailData, any>({
      path: `/user/detail`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags user-controller
   * @name DeleteUser
   * @request DELETE:/user
   * @secure
   * @response `200` `DeleteUserData` OK
   */
  deleteUser = (params: RequestParams = {}) =>
    this.request<DeleteUserData, any>({
      path: `/user`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
}
