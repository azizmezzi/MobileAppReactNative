import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';

const GlobalFunction = {
  checkNull: (element, returnElement) => {
    return element === null ? returnElement : element;
  },
  checkUndefined: (element) => {
    return element === undefined;
  },
  Choose: (Condition, element1, element2) => {
    return Condition ? element1 : element2;
  },
  SocketSys: (user, context) => {
    const socket = io.connect('http://18.130.184.230:3000/', {
      query: `token=${user.token}`,
    });
    socket.on('connect', () => {
      context.setSocket(socket);
      // eslint-disable-next-line no-underscore-dangle
      socket.emit('requestChats');
      socket.on('handleChatsRequest', async (data2) => {
        await AsyncStorage.setItem('Discussion', JSON.stringify(data2.discussion));
        context.setDiscussions(data2.discussion);
        const {notifications} = data2;
        await AsyncStorage.setItem('Notifications', JSON.stringify(notifications));
        // notifications.forEach((Notif) => {
        //   if (!Notif.vu) {
        //     this.notif.localNotif('sample.mp3', Notif.title, Notif.text);
        //   }
        // });

        context.setNotifications(data2.notifications);
      });
    });
    socket.on('receiveNewMessage', async (obj) => {
      const DiscussionStorage = await AsyncStorage.getItem('Discussion');
      if (DiscussionStorage !== null) {
        const Discussion = JSON.parse(DiscussionStorage);

        const {idDiscussion, newMessage, members} = obj;

        const discussionIndex = Discussion.findIndex((elem) => {
          return elem._id === idDiscussion;
        });

        if (discussionIndex !== -1) {
          const discussion = Discussion[discussionIndex];
          discussion.messages.push(newMessage);
          discussion.members = members;
          Discussion[discussionIndex] = discussion;
          await AsyncStorage.setItem('Discussion', JSON.stringify(Discussion));
          context.setDiscussions(Discussion);
        }
      }
    });
  },
};
export default GlobalFunction;
