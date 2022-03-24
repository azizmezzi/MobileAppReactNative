import axios from 'axios';
import requests from '../constant/config';

export const requestPasswordChange = (email) => {
  return axios.post(`${requests.requestPasswordChange}`, {email});
};

export const changeUserPassword = (email, activationCode, newPassword) => {
  return axios.put(`${requests.changeUserPassword}`, {email, activationCode, newPassword});
};

export const resendPasswordEmail = (email) => {
  return axios.post(`${requests.resendPasswordEmail}`, {email});
};
