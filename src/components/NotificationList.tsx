import React from 'react';
import { View } from 'react-native';
import NotificationCard from './NotificationCard';

type NotificationStatus = 'Read' | 'Unread';

interface Notification {
  id: number;
  title: string;
  time: string;
  status: NotificationStatus;
}

export default function NotificationList() {
  const notifications: Notification[] = [
    {
      id: 1,
      title: 'Your contract was confirmed.',
      time: '1 min ago',
      status: 'Unread',
    },
  ];

  return (
    <View>
      {notifications.map((item) => (
        <NotificationCard
          key={item.id}
          title={item.title}
          time={item.time}
          status={item.status}
        />
      ))}
    </View>
  );
}
