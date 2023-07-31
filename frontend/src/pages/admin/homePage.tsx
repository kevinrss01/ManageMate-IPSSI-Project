import AuthAPI from "@/services/AuthAPI";
import UsersAPI from "@/services/UsersAPI";
import { useEffect, useState } from "react";
import toastMessage from "@/utils/toast";
import { useRouter } from "next/navigation";
import { Color } from "@tremor/react";
import { UserStateWithId } from "@/interfaces/Interfaces";
import { formatFileSizeFromBytes } from "@/utils/fileUtils";
import { BsCashCoin, BsDatabaseFillLock } from "react-icons/bs";
import { AiOutlineDatabase } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { GiFiles } from "react-icons/gi";
import Metrics from "@/components/admin/Metrics";
import AllUsers from "@/components/admin/AllUsers";

const HomePage = () => {
  const [users, setUsers] = useState<UserStateWithId[]>();
  const [totalStorageBought, setTotalStorageBought] = useState<number>(0);
  const [totalStorageUsed, setTotalStorageUsed] = useState<number>(0);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const handleErrors = (
    consoleErrorMessage: string | unknown,
    message?: string
  ) => {
    console.error(consoleErrorMessage);
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    message ? toastMessage(message, "error") : null;
    router.push("/auth/loginPage");
  };

  const verifyUserRole = async (accessToken: string) => {
    try {
      const userRole = await AuthAPI.verifyToken(accessToken);

      if (userRole?.decodedToken?.role !== "admin") {
        toastMessage(
          "Vous n'avez pas les droits pour accéder à cette page.",
          "error"
        );
        return router.push("/app/homepage");
      }
    } catch (err) {
      handleErrors(
        "Une erreur est survenue lors de la vérification du rôle de l'utilisateur.",
        "Une erreur est survenue, veuillez vous reconnecter."
      );
    }
  };

  const getAllStorageBought = (users: UserStateWithId[]) => {
    let total = 0;
    for (const user of users) {
      total += user.totalUserStorage;
    }
    return total;
  };

  const getTotalStorageUsed = (users: UserStateWithId[]) => {
    let totalUsed = 0;

    for (const user of users) {
      console.log(user);
      for (const file of user.files) {
        totalUsed += file.size;
      }
    }
    console.log(totalUsed);
    return totalUsed;
  };

  const getTotalFiles = (users: UserStateWithId[]) => {
    let totalFiles = 0;

    for (const user of users) {
      totalFiles += user.files.length;
    }
    return totalFiles;
  };

  const fetchAllUsers = async (accessToken: string) => {
    let errorMessage = "";
    try {
      const users = await UsersAPI.getAllUsers(accessToken);
      if (users) {
        setUsers(users);
        setTotalStorageBought(getAllStorageBought(users));
        setTotalStorageUsed(getTotalStorageUsed(users));
        setTotalFiles(getTotalFiles(users));
      } else {
        errorMessage =
          "Une erreur est survenue lors de la récupération des utilisateurs.";
        return router.push("/app/homepage");
      }
    } catch (err: any) {
      if (err.toString().includes("401")) {
        errorMessage = "Vous n'avez pas les droits pour accéder à cette page.";
        return router.push("/app/homepage");
      } else {
        errorMessage =
          "Une erreur est survenue lors de la récupération des utilisateurs.";
        return router.push("/app/homepage");
      }
    } finally {
      if (errorMessage) toastMessage(errorMessage, "error");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const id = localStorage.getItem("id");
    const accessToken = localStorage.getItem("token");
    if (!id || !accessToken) {
      return handleErrors(
        "No id found or no token found, (id: ${id}, accessToken: ${accessToken})",
        "Une erreur est survenue, veuillez vous reconnecter."
      );
    }

    verifyUserRole(accessToken);
    fetchAllUsers(accessToken);
    setIsLoading(false);
  }, []);

  const categories: {
    title: string;
    metric: string;
    icon: any;
    color: Color;
  }[] = [
    {
      title: "Chiffre d'affaire",
      metric: ((totalStorageBought / 21474836480) * 20).toString() + " €",
      icon: BsCashCoin,
      color: "indigo",
    },
    {
      title: "Stockage acheté total",
      metric: formatFileSizeFromBytes(totalStorageBought),
      icon: AiOutlineDatabase,
      color: "blue",
    },
    {
      title: "Stockage vendu total",
      metric: formatFileSizeFromBytes(totalStorageUsed),
      icon: BsDatabaseFillLock,
      color: "red",
    },
    {
      title: "Nombre total de fichier",
      metric: totalFiles.toString() || "inconnu",
      icon: GiFiles,
      color: "green",
    },
    {
      title: "Nombre d'utilisateurs",
      metric: users?.length.toString() || "inconnu",
      icon: FiUsers,
      color: "amber",
    },
  ];

  return (
    <div>
      <h1 className="text-center text-3xl m-5">Page administrateur</h1>
      {isLoading ? (
        <>Loading</>
      ) : (
        <div className="p-10">
          <Metrics categories={categories} />
          <AllUsers users={users} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
