// import { create } from "zustand";
// import toast from "react-hot-toast";
// import { axiosInstance } from "../lib/axios";
// import axios from "axios";

// export const useChatStore = create((set,get) =>({
//     Message: [],
//     users: [],
//     selectedUser: null,
//     isUsersLoading: false,
//     isMessagesLoading: false,

//     getUsers: async () => {
//         set({ isUsersLoading: true });
//         try{
//             const res = await axiosInstance.get("/messages/users");
//             set({users:res.data}); 
//         }catch(error){
//             toast.error(error.response.data.Message);    
//         } finally{
//             set({ isUsersLoading: false });
//         }
//     },

//     getMessages: async (userId) => {
//         set({ isMessagesLoading: true });
//         try {
//           const res = await axiosInstance.get(`/messages/${userId}`);
//           set({ messages: res.data });
//         } catch (error) {
//           toast.error(error.response.data.message);
//         } finally {
//           set({ isMessagesLoading: false });
//         }
//       },

//       snedMessage: async(messageData) =>{
//         const{selectedUser, messages} = get()
//         try{
//           const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
//           set({messages:[...messages, res.data]});

//         }catch(error){
//           toast.error(error.response.data.message);
//         }
//       },

//       setSelectedUser:(selectedUser) =>set({selectedUser}),

// }))


import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import axios from "axios";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.Message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

  //   sendMessage: async (messageData) => {
  //     const { selectedUser, messages } = get();
  //     if (!selectedUser || !selectedUser._id) {
  //         toast.error("No user selected!");
  //         return;
  //     }
  //     try {
  //         const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
  //         set({ messages: [...messages, res.data] });
  //     } catch (error) {
  //         toast.error(error.response.data.message);
  //     }
  // },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));