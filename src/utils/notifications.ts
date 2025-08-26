import { toast } from "@/hooks/use-toast";

// Красивые уведомления с иконками и правильными сообщениями
export const notifications = {
  // Успешные операции
  success: {
    login: () => toast({
      title: "🎉 Добро пожаловать!",
      description: "Вы успешно вошли в систему",
      variant: "default",
      duration: 4000,
    }),
    
    logout: () => toast({
      title: "👋 До свидания!",
      description: "Вы успешно вышли из системы",
      variant: "default",
      duration: 3000,
    }),
    
    registration: () => toast({
      title: "🚀 Регистрация завершена!",
      description: "Добро пожаловать в PureNFT! Теперь вы можете пользоваться всеми возможностями платформы",
      variant: "default",
      duration: 5000,
    }),
    
    profileUpdated: () => toast({
      title: "✅ Профиль обновлен",
      description: "Ваши данные успешно сохранены",
      variant: "default",
      duration: 3000,
    }),
    
    avatarUploaded: () => toast({
      title: "📸 Аватар обновлен",
      description: "Ваша фотография профиля успешно загружена",
      variant: "default",
      duration: 3000,
    }),
    
    walletGenerated: () => toast({
      title: "💰 Кошелек создан",
      description: "Адрес вашего кошелька успешно сгенерирован и сохранен",
      variant: "default",
      duration: 4000,
    }),
    
    trcWalletGenerated: () => toast({
      title: "💎 USDT кошелек готов",
      description: "Ваш TRC-20 адрес для USDT успешно создан",
      variant: "default",
      duration: 4000,
    }),
    
    verificationSubmitted: () => toast({
      title: "📋 Документы отправлены",
      description: "Ваши документы переданы на верификацию. Ожидайте результат в течение 24 часов",
      variant: "default",
      duration: 5000,
    }),
    
    bidAccepted: () => toast({
      title: "🎯 Ставка принята",
      description: "Сделка успешно завершена! Средства переведены",
      variant: "default",
      duration: 4000,
    }),
    
    bidDeclined: () => toast({
      title: "❌ Ставка отклонена",
      description: "Ставка отклонена, средства возвращены покупателю",
      variant: "default",
      duration: 4000,
    }),
    
    nftCreated: () => toast({
      title: "🎨 NFT создан",
      description: "Ваш NFT успешно создан и добавлен в коллекцию",
      variant: "default",
      duration: 4000,
    }),
    
    depositProcessed: () => toast({
      title: "💳 Пополнение обработано",
      description: "Средства успешно зачислены на ваш баланс",
      variant: "default",
      duration: 4000,
    }),
    
    withdrawalRequested: () => toast({
      title: "💸 Заявка на вывод создана",
      description: "Ваша заявка принята в обработку. Средства поступят в течение 24 часов",
      variant: "default",
      duration: 5000,
    }),
    
    exchangeCompleted: () => toast({
      title: "🔄 Обмен завершен",
      description: "Валюта успешно обменена по текущему курсу",
      variant: "default",
      duration: 4000,
    }),
  },

  // Ошибки
  error: {
    loginFailed: (reason?: string) => toast({
      title: "🚫 Ошибка входа",
      description: reason || "Неверный email или пароль. Проверьте данные и попробуйте снова",
      variant: "destructive",
      duration: 5000,
    }),
    
    registrationFailed: (reason?: string) => toast({
      title: "❌ Ошибка регистрации",
      description: reason || "Не удалось создать аккаунт. Возможно, такой email уже используется",
      variant: "destructive",
      duration: 5000,
    }),
    
    rateLimitExceeded: () => toast({
      title: "⏱️ Слишком много попыток",
      description: "Превышен лимит запросов. Подождите несколько минут и попробуйте снова",
      variant: "destructive",
      duration: 6000,
    }),
    
    invalidEmail: () => toast({
      title: "📧 Неверный email",
      description: "Пожалуйста, введите корректный адрес электронной почты",
      variant: "destructive",
      duration: 4000,
    }),
    
    weakPassword: () => toast({
      title: "🔐 Слабый пароль",
      description: "Пароль должен содержать минимум 8 символов, включая буквы и цифры",
      variant: "destructive",
      duration: 5000,
    }),
    
    passwordMismatch: () => toast({
      title: "🔄 Пароли не совпадают",
      description: "Убедитесь, что пароли введены одинаково",
      variant: "destructive",
      duration: 4000,
    }),
    
    termsNotAccepted: () => toast({
      title: "📋 Согласие требуется",
      description: "Необходимо принять все условия для продолжения",
      variant: "destructive",
      duration: 4000,
    }),
    
    authRequired: () => toast({
      title: "🔒 Требуется авторизация",
      description: "Войдите в систему для выполнения этого действия",
      variant: "destructive",
      duration: 4000,
    }),
    
    profileUpdateFailed: () => toast({
      title: "❌ Ошибка обновления",
      description: "Не удалось сохранить изменения. Проверьте подключение к интернету",
      variant: "destructive",
      duration: 5000,
    }),
    
    avatarUploadFailed: () => toast({
      title: "📸 Ошибка загрузки",
      description: "Не удалось загрузить изображение. Проверьте формат и размер файла",
      variant: "destructive",
      duration: 5000,
    }),
    
    walletGenerationFailed: () => toast({
      title: "💰 Ошибка создания кошелька",
      description: "Не удалось создать адрес кошелька. Попробуйте еще раз",
      variant: "destructive",
      duration: 5000,
    }),
    
    insufficientFunds: () => toast({
      title: "💳 Недостаточно средств",
      description: "На вашем балансе недостаточно средств для выполнения операции",
      variant: "destructive",
      duration: 5000,
    }),
    
    verificationRequired: () => toast({
      title: "🔐 Требуется верификация",
      description: "Пройдите верификацию для доступа к этой функции",
      variant: "destructive",
      duration: 5000,
    }),
    
    networkError: () => toast({
      title: "🌐 Ошибка сети",
      description: "Проблема с подключением к серверу. Проверьте интернет-соединение",
      variant: "destructive",
      duration: 5000,
    }),
    
    transactionFailed: () => toast({
      title: "💸 Ошибка транзакции",
      description: "Не удалось выполнить операцию. Средства не списаны",
      variant: "destructive",
      duration: 5000,
    }),
    
    fileUploadFailed: () => toast({
      title: "📁 Ошибка загрузки файла",
      description: "Не удалось загрузить файл. Проверьте формат и размер",
      variant: "destructive",
      duration: 5000,
    }),
  },

  // Предупреждения
  warning: {
    frozenFunds: (amount: string, date: string) => toast({
      title: "❄️ Средства заморожены",
      description: `${amount} заморожены до ${date}. Это связано с покупкой NFT`,
      variant: "default",
      duration: 6000,
    }),
    
    verificationPending: () => toast({
      title: "⏳ Верификация в обработке",
      description: "Ваши документы проверяются. Это может занять до 24 часов",
      variant: "default",
      duration: 5000,
    }),
    
    highFees: () => toast({
      title: "💰 Высокая комиссия",
      description: "Текущая комиссия сети выше обычной. Рекомендуем подождать",
      variant: "default",
      duration: 5000,
    }),
    
    securityNotice: () => toast({
      title: "🛡️ Важно для безопасности",
      description: "Никогда не сообщайте никому свои приватные ключи и пароли",
      variant: "default",
      duration: 7000,
    }),
    
    minAmountWarning: (minAmount: string) => toast({
      title: "💰 Минимальная сумма",
      description: `Минимальная сумма для операции: ${minAmount}`,
      variant: "default",
      duration: 4000,
    }),
    
    maintainanceMode: () => toast({
      title: "🔧 Техническое обслуживание",
      description: "Некоторые функции временно недоступны из-за обновления системы",
      variant: "default",
      duration: 6000,
    }),
  },

  // Информационные сообщения
  info: {
    emailVerificationSent: () => toast({
      title: "📧 Письмо отправлено",
      description: "Проверьте почту и перейдите по ссылке для подтверждения",
      variant: "default",
      duration: 5000,
    }),
    
    processingTransaction: () => toast({
      title: "⏳ Обрабатываем транзакцию",
      description: "Операция может занять несколько минут. Не закрывайте страницу",
      variant: "default",
      duration: 4000,
    }),
    
    featureComingSoon: () => toast({
      title: "🚀 Скоро доступно",
      description: "Эта функция находится в разработке и будет доступна в ближайшее время",
      variant: "default",
      duration: 4000,
    }),
    
    newFeatureAnnouncement: (feature: string) => toast({
      title: "✨ Новая возможность",
      description: `Теперь доступно: ${feature}`,
      variant: "default",
      duration: 5000,
    }),
    
    dataLoading: () => toast({
      title: "⏳ Загружаем данные",
      description: "Пожалуйста, подождите...",
      variant: "default",
      duration: 2000,
    }),
    
    supportContact: () => toast({
      title: "💬 Нужна помощь?",
      description: "Свяжитесь с нашей поддержкой в Telegram",
      variant: "default",
      duration: 4000,
    }),
  }
};

// Вспомогательные функции для часто используемых уведомлений
export const showSuccessNotification = (key: keyof typeof notifications.success, ...args: any[]) => {
  const notificationFn = notifications.success[key] as (...args: any[]) => any;
  return notificationFn(...args);
};

export const showErrorNotification = (key: keyof typeof notifications.error, ...args: any[]) => {
  const notificationFn = notifications.error[key] as (...args: any[]) => any;
  return notificationFn(...args);
};

export const showWarningNotification = (key: keyof typeof notifications.warning, ...args: any[]) => {
  const notificationFn = notifications.warning[key] as (...args: any[]) => any;
  return notificationFn(...args);
};

export const showInfoNotification = (key: keyof typeof notifications.info, ...args: any[]) => {
  const notificationFn = notifications.info[key] as (...args: any[]) => any;
  return notificationFn(...args);
};