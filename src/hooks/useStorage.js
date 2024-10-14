import { useEffect, useState } from "react";
import { Storage } from "@ionic/storage";
import { useDispatch, useSelector } from "react-redux";
import { addDate, loadFile } from "../store/userDataSlice";

const VALUES_KEY = 'userData';

export function useStorage() {
const userState = useSelector((state) => state.userData);
const dispatch = useDispatch();
const [store, setStore] = useState();

useEffect(()  => {
    const initStorage = async () => {
        const newStore = new Storage({
            name: 'userDataStorage'
        });
        const store = await newStore.create();
        setStore(store);

        const storedValues = await store.get("userData");
        loadState(storedValues)
    }
    initStorage();
}, []);

const saveState = async () => {
    // console.log("before save", userState);
    store?.set(VALUES_KEY, userState);
    // console.log("after save", userState);
};

const loadState = async (values) => {
    // console.log("before load", values, userState)
    dispatch(loadFile(values));
    // console.log("after load", values, userState);
};

useEffect(() => {
    saveState();
    dispatch(addDate());  
}, [userState])

return {
    saveState,
    loadState
}} 