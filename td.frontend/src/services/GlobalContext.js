import { createContext, useContext, useEffect, useState } from 'react';
import { getClients, getEmployees } from './API';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isUser, setIsUser] = useState(false);
 
  const loggedUserName = localStorage.getItem('userName');
  const loggedUserMail = localStorage.getItem('userEmail');


  useEffect(() => {
    const fetchData = async () => {
      const empData = await getEmployees();      
      const clientData = await getClients();      
      setUsers(empData);
      setAllClients(clientData);
      const clientId = empData.find((user) => user.username === loggedUserName)?.projectId;
      if(empData && empData.length > 0){
        const userDetailes = empData?.find((item) => item.username === loggedUserName && item.projectId?.toString() === clientId.toString());
          if(userDetailes){
            if(userDetailes?.permission?.trim() === "Admin"){
              setIsAdmin(true)
            }
            if(userDetailes.permission.trim() === "Manager"){
              setIsManager(true)
            }
            if(userDetailes.permission.trim() === "User" ){
              setIsUser(true)
            }
          }
      }
      setLoading(false);
    };

    fetchData();
  }, [loggedUserName]);

  const user = users.find((user) => user.username === loggedUserName);

  const value = {
    loggedUserName,
    loggedUserMail,
    users,
    allClients,
    user,
    isAdmin,
    isManager,
    isUser,
    loading
  };
  console.log(value)

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook
export const useGlobalData = () => useContext(GlobalContext);
