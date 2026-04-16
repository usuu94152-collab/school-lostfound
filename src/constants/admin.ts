export const ADMIN_SESSION_STORAGE_KEY = 'school-app:is-admin-authenticated'

// 운영 전에 실제 학교 비밀번호로 꼭 변경하세요.
export const ADMIN_PASSWORD =
  import.meta.env.VITE_ADMIN_PASSWORD?.trim() || 'school1234'
