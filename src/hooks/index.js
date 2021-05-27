import { useEffect, useState } from "react";
import faker from "faker";

import { db, analytics } from "../utils/firestore";

export const useCreateDonate = () => {
  const [state, setState] = useState();
  const [counter, setCounter] = useState(0);

  const createDonate = () => setCounter(counter + 1);

  useEffect(() => {
    const request = async () => {
      try {
        setState("pending");
        const docRef = db.collection("donates").doc(faker.datatype.uuid());

        const newDonate = {
          name: faker.name.findName(),
          amount: faker.datatype.number({ min: 10, max: 100 }),
          createdAt: new Date(),
        };

        await docRef.set(newDonate);
        analytics.logEvent("Donate created", { ...newDonate });

        setState("success");
      } catch (err) {
        console.log(err);
        setState("error");
      }
    };

    if (!!counter) {
      request();
    }
  }, [counter]);

  return { state, createDonate };
};

export const useFetchDonates = () => {
  const [donates, setDonates] = useState([]);
  const [state, setState] = useState("pending");

  useEffect(() => {
    try {
      const unsubscribe = db.collection("donates").onSnapshot((snapshot) => {
        const items = [];

        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const newDonate = change.doc.data();
            items.push(newDonate);
          }
        });
        setDonates((state) => [...state, ...items]);
        setState("success");
        analytics.logEvent("Donates fetched");
      });

      return unsubscribe;
    } catch (err) {
      console.log(err);
      setState("error");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { donates, state };
};

export const useFetchTotal = ({ trigger }) => {
  const [total, setTotal] = useState(0);
  const [state, setState] = useState("pending");

  useEffect(() => {
    const request = async () => {
      setState("pending");
      try {
        const donatesRef = await db.collection("donates").get();

        let total = 0;

        donatesRef.forEach((doc) => {
          const donate = doc.data();
          total += donate.amount;
        });

        setTotal(total);
        setState("success");
      } catch (err) {
        console.log(err);
        setState("error");
      }
    };

    request();
  }, [trigger]);

  return { total, state };
};
