// https://service-ase3oocp-1302839645.sh.apigw.tencentcs.com/api/room/room/getRoomList?pageNo=1&pageSize=3
import { http } from '@/utils/http';
import { IResult, IRoomDetailsParams, IRoomListParams } from '../interface';

// 真实接口
export function fetchRoomList(params: IRoomListParams): Promise<IResult> {
  return http.get('/proxy/api/room/room/getRoomList', {
    params
  });
}

export function fetchRoomDetails(params: IRoomDetailsParams): Promise<IResult> {
  return http.get('/proxy/api/room/room/getRoomDetail', {
    params
  });
}