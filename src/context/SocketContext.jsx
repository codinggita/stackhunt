import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/notifications', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setNotifications(res.data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };
      
      fetchNotifications();

      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      newSocket.emit('join', user._id || user.id);

      newSocket.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      newSocket.on('newBounty', (bounty) => {
        // Only notify developers about new bounties
        if (user.role === 'developer') {
          const notif = {
            message: `New bounty: ${bounty.title}`,
            type: 'bounty_created',
            createdAt: new Date(),
            isRead: false
          };
          setNotifications((prev) => [notif, ...prev]);
        }
      });

      newSocket.on('submissionStatusChange', (data) => {
        const notif = {
          message: `Your submission for "${data.bountyTitle}" is now: ${data.status}`,
          type: 'submission_accepted',
          createdAt: new Date(),
          isRead: false
        };
        setNotifications((prev) => [notif, ...prev]);
      });

      return () => {
        newSocket.emit('leave', user._id || user.id);
        newSocket.close();
      };
    }
  }, [user]);

  const markAsRead = async (notifId) => {
    try {
      if (notifId) {
        await axios.put(`http://localhost:5000/api/notifications/${notifId}`, {}, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setNotifications(prev => prev.map(n => n._id === notifId ? { ...n, isRead: true } : n));
      } else {
        await axios.put('http://localhost:5000/api/notifications/mark-all-read', {}, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, markAsRead, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
