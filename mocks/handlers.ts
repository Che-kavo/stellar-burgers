import { 
    http, // модуль для мокирования сетевых запросов
    HttpResponse // класс ответа на запрос
} from 'msw'

export const handlers = [
    http.get('https://school-api/get-grades*', () => {
        return HttpResponse.json({
            math: 5,
            programming: 5,
            physics: 5
        });
    })
]; 
