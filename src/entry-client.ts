// mounts the app to a DOM element
import { airbnbDB } from './db';
import languagesObjectStore from './db/objectStores/languages';
import reservationsObjectStore from './db/objectStores/reservations';
import usersObjectStore from './db/objectStores/users';
import { createApp } from './main';
import { useAuthStore } from './stores/auth';
import { useLocaleStore } from './stores/locale';
import { useRoomsStore } from './stores/rooms';
import { getCookie } from './utils/util';

const { app, router, pinia } = createApp();

// 初始化 Pinia
// 注意：__INITIAL_STATE__需要在 src/types/shims-global.d.ts中定义
if (window.__INITIAL_STATE__) {
  pinia.state.value = JSON.parse(window.__INITIAL_STATE__);
}

router.beforeEach(async (_to, _from, next) => {
  console.log(1);

  // 初始化所有对象仓库
  await airbnbDB.open([
    usersObjectStore,
    languagesObjectStore,
    reservationsObjectStore
  ]);

  // 初始化语言
  const localeStore = useLocaleStore();
  localeStore.getLanguage();

  // 初始化房屋列表
  const roomsStore = useRoomsStore();
  roomsStore.getRooms();

  // 初始化用户
  const authStore = useAuthStore();
  authStore.initAuthentication();

  next();
});

// wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
  app.mount('#app');
});
