/* eslint-disable @typescript-eslint/no-explicit-any */
// code: '000000' 表示 '操作成功'
// code: '000001' 表示 '手机号已存在'
// code: '000002' 表示 '手机号不存在'
// code: '000003' 表示 '密码不正确'
// code: '000004' 表示 '其他异常'
// code: '000005' 表示 '登录过期'

import { airbnbDB } from '@/db';
import reservationsObjectStore from '@/db/objectStores/reservations';
import { ElLoading, ElMessage } from 'element-plus';

const storeName = Object.keys(reservationsObjectStore)[0];

// Mock接口：预订
export const saveReservationAPI = async (params: any) => {
  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.2)'
  });

  try {
    const allReservations = (await airbnbDB.getList(storeName)) as any[];
    const result = allReservations.find((item) => {
      return item.reservationId === params.reservationId;
    });

    if (!result) {
      // 数据不存在，新增一条订单数据
      await airbnbDB.addItem(storeName, params);

      return {
        code: '000000',
        message: '操作成功',
        success: true,
        result: null
      };
    } else {
      // 存在相同订单数据
      return {
        code: '000001',
        message: '订单已存在',
        success: false,
        result: null
      };
    }
  } catch (error) {
    console.error(error);
    ElMessage({
      type: 'error',
      message: `数据库查询出现异常: ${error}`,
      showClose: true
    });
  } finally {
    setTimeout(() => {
      loading.close();
    }, 300);
  }
};

// Mock接口：房源订单列表
export const fetchReservationListAPI = async () => {
  try {
    const reservations = (await airbnbDB.getList(storeName)) as any[];
    console.log('All reservations', reservations);
  } catch (error) {
    console.error(error);
    ElMessage({
      type: 'error',
      message: `数据库查询出现异常: ${error}`,
      showClose: true
    });
  }
};