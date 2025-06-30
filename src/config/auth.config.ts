import { Environments } from '@/constants/enums';

export const authConfig = {
  // تكوين الجلسة
  session: {
    strategy: 'jwt' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 أيام
    updateAge: 24 * 60 * 60, // يوم واحد
  },

  // تكوين الأمان
  security: {
    maxAge: 60 * 60 * 24 * 7, // 7 أيام
    secure: process.env.NODE_ENV === Environments.PROD,
    sameSite: 'lax' as const,
    path: '/',
  },

  // تكوين الكوكيز
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === Environments.PROD,
      },
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === Environments.PROD,
      },
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === Environments.PROD,
      },
    },
  },

  // تكوين الحدود
  limits: {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 دقيقة
    passwordMinLength: 8,
    passwordMaxLength: 128,
  },

  // تكوين الرسائل
  messages: {
    errors: {
      configuration: 'خطأ في إعدادات المصادقة. يرجى التحقق من ملف .env.local',
      accessDenied: 'تم رفض الوصول. يرجى تسجيل الدخول أولاً',
      verification: 'فشل التحقق من البريد الإلكتروني',
      default: 'حدث خطأ غير متوقع',
    },
  },
}; 