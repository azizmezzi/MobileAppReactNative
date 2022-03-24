import axios from 'axios';

import requests from '../constant/config';

export const ActivateAccount = (secretToken, code, codeParrainage) => {
  return axios.put(`${requests.ActivateAccount}${secretToken}`, {code, codeParrainage});
};

export const ResendActivationEmail = (secretToken) => {
  return axios.post(`${requests.ResendActivationEmail}${secretToken}`);
};

export const login = (email, password, pro, deviceToken) => {
  return axios.post(requests.login, {
    email,
    password,
    pro,
    deviceToken,
  });
};

export const register = (user) => {
  // const {email, password, name, gender, dob, locality} = user;
  // eslint-disable-next-line no-undef
  const bodyFormData = new FormData();
  bodyFormData.append('user', JSON.stringify(user));
  bodyFormData.append('file', {
    uri: user.url,
    type: 'image/png',
    name: 'imagename.png',
  });
  return axios({
    method: 'POST',
    url: requests.register,
    data: bodyFormData,
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

export const checkEmailExists = (email) => {
  return axios.get(`${requests.checkEmailExists}${email}`);
};

export const getParticipant = (secretToken, _id) => {
  return axios.get(`${requests.getParticipant}${secretToken}&_id=${_id}`);
};

export const updateDescription = (secretToken, description) => {
  return axios.post(`${requests.updateProfile}${secretToken}`, {
    description,
  });
};

export const autoCompletePlace = (query) => {
  const url = 'https://autocomplete.search.hereapi.com/v1/geocode?q=';
  const apiKey = 'uRjEIjzBxyp3VvAK69ahIy2-Q1EryMD3U8k7bLiQdos';
  return axios.get(`${url}${query}&apiKey=${apiKey}&lang=fr`);
};

export const updateCentreInteret = (secretToken, centreInteret) => {
  return axios.post(`${requests.updateProfile}${secretToken}`, {
    centreInteret,
  });
};

export const getNotification = (secretToken) => {
  return axios.get(`${requests.getNotifications}${secretToken}`);
};

export const CreateAlert = (Alert, secretToken) => {
  return axios.put(`${requests.CreateAlert}${secretToken}`, {Alert});
};

export const UpdateAlertState = (alerts, secretToken) => {
  return axios.put(`${requests.UpdateAlertState}${secretToken}`, {alerts});
};

export const updateProfileData = (data, secretToken) => {
  return axios.put(`${requests.updateProfileData}${secretToken}`, data);
};

export const unsubscribeUser = (secretToken, raison) => {
  return axios.put(`${requests.unsubscribeUser}${secretToken}`, {raison});
};

export const DisablePushNotif = (secretToken) => {
  return axios.put(`${requests.DisablePushNotif}${secretToken}`);
};

export const setNotificationAncien = (secretToken, notifId) => {
  return axios.put(`${requests.setNotificationAncien}${secretToken}`, {notifId});
};

export const RecommendUser = (secretToken, recommended, rating) => {
  return axios.put(`${requests.RecommendUser}${secretToken}`, {recommended, rating});
};

export const AcheterToken = (secretToken, number) => {
  return axios.put(`${requests.AcheterToken}${secretToken}`, {number});
};

export const AnnulerPremium = (secretToken) => {
  return axios.put(`${requests.AnnulerPremium}${secretToken}`);
};

export const RemoveDeviceToken = (secretToken, deviceToken) => {
  return axios.put(`${requests.RemoveDeviceToken}${secretToken}`, {deviceToken});
};

export const UpdateUserPhoto = (secretToken, id, url, oldImage) => {
  // eslint-disable-next-line no-undef
  const bodyFormData = new FormData();
  bodyFormData.append('file', {
    uri: url,
    type: 'image/png',
    name: `${id}.png`,
  });
  bodyFormData.append('oldFile', oldImage);
  return axios({
    method: 'PUT',
    url: `${requests.UpdateUserPhoto}${secretToken}`,
    data: bodyFormData,
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

export const IsProUserEnabled = (secretToken) => {
  return axios.get(`${requests.IsProUserEnabled}${secretToken}`);
};
