import { useQuery } from "@tanstack/react-query"
import { fetchMe } from "../api/fetchMe"
import { queryClient } from "../utils/queryClient"
import { FC, ReactNode, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUserName } from "../store/slices"
import App from "../App"
import { RootState } from "../store"
import RegisterSuccess from "./RegisterSuccess"

interface AccountProps {
    children:ReactNode
}


const Account:FC<AccountProps> = ({children}) => {
    const successRegister = useSelector((state: RootState) => state.auth.successRegister)
    const dispatch = useDispatch();

    const myQuery = useQuery({
        queryFn: () => fetchMe(),
        queryKey: ["users", "me"],
        retry: false
    }, queryClient);

    console.log("myQuery:", myQuery)

    const name = myQuery.data?.name

    useEffect(() => {
        console.log("myQuery.status:", myQuery.status)
        if (myQuery.status === "success" && name) {
            console.log("вошёл");
            dispatch(setUserName(name))
        }
      }, [myQuery.status, name, dispatch])

    switch (myQuery.status) {
        case "pending":
            return <div>Загрузка</div>
    
        case "error":
            console.log("erorr");
            dispatch(setUserName(""))
            return <>
            <App />
            {successRegister && 
            <RegisterSuccess/>}
            </>

        case "success":
            console.log("Вход");
         return <>{children}</>;
    }
}

export default Account;