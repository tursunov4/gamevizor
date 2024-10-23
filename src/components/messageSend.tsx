import axios from 'axios';

interface SendMessageData {
  message: string;
  chat_id: number;
}

const sendMessage = async (data: SendMessageData): Promise<void> => {
  try {
    const token = localStorage.getItem('token'); // Получение токена из localStorage

    if (!token) {
      // Обработка отсутствия токена (например, перенаправление на страницу авторизации)
      console.error('Токен не найден в localStorage');
      return; 
    }

    const response = await axios.post('/api/v1/chat/message/send/', data, {
      headers: {
        Authorization: `Token ${token}`, // Добавление токена в заголовок Authorization
      },
    });

    // Обработка успешного ответа (например, показ уведомления о отправке сообщения)
    console.log('Сообщение отправлено успешно:', response.data);
  } catch (error) {
    // Обработка ошибок (например, показ сообщения об ошибке)
    console.error('Ошибка отправки сообщения:', error);
  }
};

export default sendMessage;