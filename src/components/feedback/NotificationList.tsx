import React from 'react';

type NotificationItem = {
  id: number;
  content: string;
  language: string;
};

type Props = {
  items: NotificationItem[];
};

const NotificationList = ({ items }: Props) => {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">새로운 알림이 없습니다.</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map(item => (
        <li key={item.id} className="flex items-start gap-2 text-sm text-gray-700">
          <span>{item.content}</span>
        </li>
      ))}
    </ul>
  );
};

export default NotificationList;
