/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import requests from '../constant/config';

export const createFeedback = (secretToken, obj) => {
  return axios.post(`${requests.createFeedback}${secretToken}`, obj);
};
