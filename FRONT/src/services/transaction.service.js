import axios from "axios";
const API_URL = "http://localhost:4444/transactions/";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/**
 * Сервис работы с транзакциями
 */
axios.interceptors.request.use(
  (config) => {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log(user)

      if (user) {
          config.headers['Authorization'] = `Bearer ${user.accessToken}`;
      }

      return config;
  },

  (error) => {
      return Promise.reject(error);
  }
);

/**
 * Получить транцакцию по id транзакции
 * @param {number} id 
 * @returns 
 */
const getTransactionsById = (id) => {
  return axios.get(API_URL + id);
};

/**
 * Получить все транцакции текущего пользователя
 * @returns 
 */
const getTransactions = () => {
  return axios.get(API_URL);
};

/**
 * Добавить транзакции
 * @param {*} param0 
 * @returns 
 */
const addTransaction = async ({ category, amount, reason }) => {
  const response = await axios.post(API_URL, {
    category,
    amount,
    reason
  });
  return response.data;
};

/**
 * Удалить транцакцию по id транзакции
 * @param {number} id 
 * @returns 
 */
const deleteTransactionsById = (id) => {
  return axios.delete(API_URL + id);
};


const TrnsactionService = {
  getTransactions,
  getTransactionsById,
  deleteTransactionsById,
  addTransaction
};

export default TrnsactionService;
