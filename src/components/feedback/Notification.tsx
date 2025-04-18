import { useEffect, useState, useRef } from 'react';
import Bell from '@/components/animations/Bell';
import Modal from '@/components/feedback/Modal';
import NotificationList from './NotificationList';

type NotificationItem = {
  id: number;
  content: string;
  language: string;
};

type NotificationProps = {
  items: NotificationItem[];
};

const Notification = ({ items }: NotificationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [prevCount, setPrevCount] = useState(items.length);

  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const modalHandler = () => setIsOpen(prev => !prev);

  const countAnimation = () => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    let repeat = 3;
    for (let i = 0; i < repeat; i++) {
      const on = setTimeout(() => setIsPlaying(true), 1.5 * i * 1000);
      const off = setTimeout(() => setIsPlaying(false), (1.5 * i + 1) * 1000);
      timeoutRefs.current.push(on, off);
    }
  };

  useEffect(() => {
    if (items.length !== prevCount) {
      setPrevCount(items.length);
      countAnimation();
    }
  }, [items.length, prevCount]);

  useEffect(() => {
    setIsPlaying(isHovered);
  }, [isHovered]);

  return (
    <div className="relative">
      {/*모달 핸들러*/}
      <div
        onClick={modalHandler}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="cursor-pointer"
      >
        <Bell isPlaying={isPlaying} />
      </div>
      {items.length > 0 && (
        <div className="absolute -top-0 -right-0 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
          {items.length > 99 ? '99+' : items.length}
        </div>
      )}
      <Modal isOpen={isOpen} onClose={modalHandler}>
        <div className="text-gray-800">
          <h2 className="text-lg font-semibold mb-4">알림</h2>
          <NotificationList items={items} />
        </div>
      </Modal>
    </div>
  );
};

export default Notification;
