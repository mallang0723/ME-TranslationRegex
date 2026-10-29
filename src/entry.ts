import { start } from './runtime';
try { start(marinara, window); }
catch { marinara.log.error('번역문 정규식 초기화 실패. 확장을 다시 켜 주세요.'); }
