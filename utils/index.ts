//thời gian hết hạn redis
export const expirationTime = 12 * 60 * 60 * 1000; // 8 giờ (milliseconds)
export const expiresIn = '12h'

// export const expirationTime = 30 * 1000; // 30 giây (milliseconds)
// export const expiresIn = '30s'; // 30 giây


export const CheckRoles = {
  ADMIN: 1,
  QUANLY: 2,
  TUVAN: 3,
  GOOGLE: 4,
}