"use client";
// import { NotificationType } from "@/lib/prisma-types/Notification";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import UserAvatar from "./Useravatar";

// Dummy getTimeDistance function
const getTimeDistance = (date: Date | string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  return `${Math.floor(diffInMinutes / 1440)}d`;
};

interface NotificationProps {
  notification: any; // NotificationType;
}

export const NotificationContentType = ({
  notification,
}: NotificationProps) => {
  const formattedMessage = (notification.body || '').replace(
    /\((.*?)\)/g,
    (_: string, innerText: string) => `<strong>${innerText}</strong>`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "p-4 mb-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-primary/10 transition-colors duration-300 ",
        !notification.isRead && "bg-primary/10"
      )}
      //   onClick={() => onRead(notification.id)}
      whileHover={{ x: 4 }}
    >
      {notification.imageURL ? (
        <UserAvatar imageUrl={notification.imageURL} userName="C" />
      ) : (
        <div className="rounded-full bg-[#164bac]  p-2 shadow-sm">
          <Briefcase className="text-primary" size={20} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-semibold truncate text-sm">
            {notification.title}
          </h4>
          {notification.createdAt && (
            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
              {getTimeDistance(notification.createdAt)} ago
            </span>
          )}
        </div>
        <p
          className="text-xs text-muted-foreground line-clamp-3"
          dangerouslySetInnerHTML={{ __html: formattedMessage }}
        />
      </div>
    </motion.div>
  );
};
