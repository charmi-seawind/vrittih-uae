import { Popover } from "../ui/popover";
// 🟠 API and auth imports commented out
// import { getUnreadNotificationCount } from "@/data-access/notification/getNotificationCount";
import NotificationClient from "./NotificationClient";
// import { auth } from "@/lib/auth";
// import { signOut } from "@/auth";

const Notification = () => {
  // 🟠 Auth logic commented out
  // const session = await auth();
  // if (!session || !session.user || !session.user.id) {
  //   await signOut();
  //   return;
  // }
  // const unreadCount = await getUnreadNotificationCount();

  // 🔹 Dummy user data
  const dummyUserId = "dummy-user-id";
  const dummyUnreadCount = 3;

  return (
    <>
      <Popover>
        <NotificationClient
          userId={dummyUserId}
          notificationCount={dummyUnreadCount}
        />
      </Popover>
    </>
  );
};
export default Notification;
