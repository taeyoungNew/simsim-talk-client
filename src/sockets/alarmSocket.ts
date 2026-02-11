import { getSocket } from ".";

export const getMsgAlarmsSocket = () => {
  const socket = getSocket();

  if (!socket?.connected) {
    socket?.connect();
  }

  socket?.emit("getMsgAlarms", null, (res: any) => {
    if (!res.ok) {
      getMsgAlarmsSocket();
      return;
    }
  });
};

export const msgAlarmsRead = (chatRoomId: string) => {
  const socket = getSocket();

  if (!socket?.connected) {
    socket?.connect();
  }

  socket?.emit("msgAlarmsRead", { chatRoomId });
};
