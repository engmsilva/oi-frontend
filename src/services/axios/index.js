import axios from 'axios';
import CONFIG from '../../config';

const apiClient = axios.create({
  baseURL: CONFIG.URL_API,
});

export default apiClient