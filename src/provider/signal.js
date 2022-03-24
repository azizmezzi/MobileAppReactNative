/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import requests from '../constant/config';

export const createSignal = (secretToken, reported, raison, type) => {
  return axios.post(`${requests.createSignal}${secretToken}`, {reported, raison, type});
};
