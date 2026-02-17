"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { NotificationContentType } from "./NotificationContentType";
// 🟠 API hook commented out
// import { useNotificationInfinityQuery } from "@/hooks/query-hooks/useNotificationInfinityQuery";
import NotificationItemSkeleton from "../skeletons/NotificationItemSkeleton";
import InfiniteScrollContainer from "./InfiniteScrollContainer";

interface NotificationContainerProps {
  notificationCount: number;
  setNotificationCount: (count: number) => void;
  userId: string;
}

const NotificationContainer = ({
  notificationCount,
  setNotificationCount,
  userId,
}: NotificationContainerProps) => {
  // 🟠 API hook commented out
  // const {
  //   data,
  //   status,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetching,
  //   isFetchingNextPage,
  // } = useNotificationInfinityQuery();
  // const notifications =
  //   data?.pages.flatMap((page) => page.data?.data.notifications) ?? [];
  
  // 🔹 Dummy notification data
  const status = "success";
  const hasNextPage = false;
  const isFetching = false;
  const isFetchingNextPage = false;
  const fetchNextPage = () => {};
  
  const notifications = [
    {
      id: '1',
      title: 'Application Update',
      message: 'Your application for Frontend Developer has been reviewed',
      createdAt: new Date(),
      isRead: false,
      type: 'APPLICATION_UPDATE'
    },
    {
      id: '2', 
      title: 'New Job Match',
      message: 'We found a new job that matches your profile',
      createdAt: new Date(Date.now() - 86400000),
      isRead: true,
      type: 'JOB_MATCH'
    },
    {
      id: '3',
      title: 'Interview Scheduled',
      message: 'Your interview with Tech Corp is scheduled for tomorrow',
      createdAt: new Date(Date.now() - 172800000),
      isRead: false,
      type: 'INTERVIEW_SCHEDULED'
    }
  ];
  
  if (status === "loading") {
    return <NotificationItemSkeleton />;
  }
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An Error Occur While Loading the notifications
      </p>
    );
  }

  if (status === "success" && notifications.length === 0 && !hasNextPage) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-full bg-[#164bac]   p-6 mb-4"
        >
          <Bell className="h-10 w-10 text-orange-400" />
        </motion.div>
        <p className="text-muted-foreground">No notifications yet</p>
      </div>
    );
  }

  return (
    <>
      <InfiniteScrollContainer
        rootMargin="100px"
        className="p-3 max-h-[400px] overflow-y-auto "
        onBottomReached={() => {
          hasNextPage && !isFetching && fetchNextPage();
        }}
      >
        {notifications.map((notification, index) => {
          return (
            <AnimatePresence key={notification?.id}>
              <motion.div
                key={notification?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <NotificationContentType notification={notification!} />
              </motion.div>
            </AnimatePresence>
          );
        })}
        {isFetchingNextPage && <NotificationItemSkeleton length={5} />}
      </InfiniteScrollContainer>
    </>
  );
};
export default NotificationContainer;
