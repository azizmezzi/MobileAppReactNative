import axios from 'axios';

import requests from '../constant/config';

export const createEvent = (event, secretToken) => {
  // eslint-disable-next-line no-undef
  const bodyFormData = new FormData();
  bodyFormData.append('event', JSON.stringify(event));
  bodyFormData.append('file', {
    uri: event.url,
    type: 'image/png',
    name: 'imagename.png',
  });

  return axios.post(`${requests.createEvent}${secretToken}`, bodyFormData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

export const createEvent2 = (event, secretToken) => {
  return axios.post(`${requests.createEvent2}${secretToken}`, {event});
};

export const PublierEventProvider = (eventId, secretToken) => {
  return axios.put(`${requests.PublierEvent}${secretToken}`, {eventId});
};

export const participateInEvent = (event, secretToken) => {
  return axios.put(`${requests.participateInEvent}${secretToken}`, {eventId: event});
};

export const ReParticipateInEvent = (event, secretToken) => {
  return axios.post(`${requests.ReParticipateInEvent}${secretToken}`, {eventId: event});
};

export const getEvents = (secretToken, latitude, longitude) => {
  return axios.get(
    `${requests.getEvents}${secretToken}&latitude=${latitude}&longitude=${longitude}`,
  );
};

export const AddToAgenda = (event, secretToken) => {
  return axios.post(`${requests.AddToAgenda}${secretToken}`, {eventId: event});
};

export const desincription = (event, secretToken, jeton) => {
  return axios.post(`${requests.desincription}${secretToken}`, {eventId: event, jeton});
};

export const AnnulerEvent = (event, secretToken) => {
  return axios.put(`${requests.AnnulerEvent}${secretToken}`, {eventId: event});
};

export const LikeDislikeEvent = (event, secretToken) => {
  return axios.put(`${requests.likeDislikeEvent}${secretToken}`, {eventId: event});
};

export const getBalance = (secretToken) => {
  return axios.get(`${requests.getBalance}${secretToken}`);
};

export const ModifEvent = (secretToken, body) => {
  return axios.post(`${requests.ModifEvent}${secretToken}`, body);
};

export const getParticipantRaiting = (secretToken) => {
  return axios.get(`${requests.getParticipantRaiting}${secretToken}`);
};

export const raiting = (secretToken, recommended, events) => {
  return axios.post(`${requests.raiting}${secretToken}`, {recommended, events});
};

export const DeleteSavedEvent = (eventId, secretToken) => {
  return axios.put(`${requests.DeleteSavedEvent}${secretToken}`, {eventId});
};

export const ReadDiscussion = (discussionId, secretToken) => {
  return axios.put(`${requests.ReadDiscussion}${secretToken}`, {discussionId});
};

export const ModifEventImage1 = (image, secretToken) => {
  // eslint-disable-next-line no-undef
  const bodyFormData = new FormData();
  bodyFormData.append('image', JSON.stringify(image));
  bodyFormData.append('file', {
    uri: image.image,
    type: 'image/png',
    name: 'imagename.png',
  });
  return axios({
    method: 'POST',
    url: `${requests.ModifEventImage1}${secretToken}`,
    data: bodyFormData,
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

export const ModifEventImage2 = (image, secretToken) => {
  return axios.post(`${requests.ModifEventImage2}${secretToken}`, image);
};
