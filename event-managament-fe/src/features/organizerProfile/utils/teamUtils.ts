export const getRoleColor = (role: string) => {
  switch (role?.toUpperCase()) {
    case "OWNER":
    case "ADMIN":
      return {
        bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
        textColor: "text-indigo-700 dark:text-indigo-400",
        borderColor: "border-indigo-200 dark:border-indigo-800",
      };
    case "EDITOR":
    case "MANAGER":
      return {
        bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
        textColor: "text-emerald-600 dark:text-emerald-400",
        borderColor: "border-emerald-200 dark:border-emerald-800",
      };
    default:
      return {
        bgColor: "bg-gray-100 dark:bg-gray-800",
        textColor: "text-gray-600 dark:text-gray-300",
        borderColor: "border-gray-200 dark:border-gray-700",
      };
  }
};

export const getInitials = (name?: string) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};
