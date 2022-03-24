/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import requests from '../constant/config';

export const createSuggestion = (secretToken, interest) => {
  return axios.post(`${requests.createInterestSuggestion}${secretToken}`, {interest});
};
