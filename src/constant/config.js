const endpoint = 'http://18.130.184.230:3000/';
const config = {
  ActivateAccount: `${endpoint}authentification/ActivateAccount?secret_token=`,
  ResendActivationEmail: `${endpoint}authentification/ResendActivationEmail?secret_token=`,
  login: `${endpoint}authentification/login`,
  register: `${endpoint}authentification/register`,
  checkEmailExists: `${endpoint}authentification/CheckEmailExists?email=`,
  getParticipant: `${endpoint}authentification/getParticipant?secret_token=`,
  updateProfile: `${endpoint}authentification/updateProfile?secret_token=`,
  CreateAlert: `${endpoint}authentification/CreateAlert?secret_token=`,
  UpdateAlertState: `${endpoint}authentification/UpdateAlertState?secret_token=`,
  updateProfileData: `${endpoint}authentification/updateProfileData?secret_token=`,
  unsubscribeUser: `${endpoint}authentification/unsubscribeUser?secret_token=`,
  DisablePushNotif: `${endpoint}authentification/DisablePushNotif?secret_token=`,
  RecommendUser: `${endpoint}authentification/RecommendUser?secret_token=`,
  AcheterToken: `${endpoint}authentification/AcheterToken?secret_token=`,
  AnnulerPremium: `${endpoint}authentification/AnnulerPremium?secret_token=`,
  RemoveDeviceToken: `${endpoint}authentification/RemoveDeviceToken?secret_token=`,
  UpdateUserPhoto: `${endpoint}authentification/UpdateUserPhoto?secret_token=`,
  IsProUserEnabled: `${endpoint}authentification/IsProUserEnabled?secret_token=`,

  createEvent: `${endpoint}events/create?secret_token=`,
  createEvent2: `${endpoint}events/create2?secret_token=`,
  ModifEventImage1: `${endpoint}events/ModifEventImage1?secret_token=`,
  ModifEventImage2: `${endpoint}events/ModifEventImage2?secret_token=`,
  PublierEvent: `${endpoint}events/PublierEvent?secret_token=`,
  participateInEvent: `${endpoint}events/participate?secret_token=`,
  ReParticipateInEvent: `${endpoint}events/reparticipate?secret_token=`,
  desincription: `${endpoint}events/desincription?secret_token=`,
  AnnulerEvent: `${endpoint}events/AnnulerEvent?secret_token=`,
  AddToAgenda: `${endpoint}events/AddToAgenda?secret_token=`,
  getEvents: `${endpoint}events/getEvents?secret_token=`,
  getBalance: `${endpoint}events/getBalance?secret_token=`,
  getNotifications: `${endpoint}notifications/getNotifications?secret_token=`,
  likeDislikeEvent: `${endpoint}events/LikeDislikeEvent?secret_token=`,
  setNotificationAncien: `${endpoint}notifications/updateNotification?secret_token=`,
  ModifEvent: `${endpoint}events/ModifEvent?secret_token=`,
  getParticipantRaiting: `${endpoint}events/getParticipantRaiting?secret_token=`,
  raiting: `${endpoint}events/raiting?secret_token=`,
  DeleteSavedEvent: `${endpoint}events/DeleteSavedEvent?secret_token=`,

  createInterestSuggestion: `${endpoint}interestSuggestion/createSuggestion?secret_token=`,

  createFeedback: `${endpoint}avis/createFeedback?secret_token=`,

  requestPasswordChange: `${endpoint}password/requestPasswordChange`,
  changeUserPassword: `${endpoint}password/changeUserPassword`,
  resendPasswordEmail: `${endpoint}password/resendPasswordEmail`,

  createSignal: `${endpoint}signal/createSignal?secret_token=`,
  ReadDiscussion: `${endpoint}events/ReadDiscussion?secret_token=`,
};

export default config;
