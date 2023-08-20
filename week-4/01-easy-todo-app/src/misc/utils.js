import axios from 'axios';
import { BASE_URL } from './config';

export async function fetchAllTodos() {
  const res = await axios.get(`${BASE_URL}/todos`);
  return res.data;
}
