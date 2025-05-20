import DebateRoutes from './DebateRoutes';
import { useDebateStore } from './store';
import * as components from './components';
import * as utils from './utils';
import * as api from './api';
// 모든 모듈 재노출
export { DebateRoutes, useDebateStore, components, utils, api };
// 사용 편의성을 위해 자주 사용하는 컴포넌트 직접 노출
export const { DebateList, DebateItem, VoteProgress, ReactionButtons, CountryStats } = components;
// Default export for the main entry point
export default DebateRoutes;
