
import React, { useEffect, useState } from "react";
import { getCollection } from "@/lib/firestore";
import { Doctor } from "@/lib/types";

const Fetch = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      const data = await getCollection("doctor");
      setDoctors(data as Doctor[]);
      console.log(data);
      console.log("fetching Docs");
      setLoading(false);
    };

    fetchDoctors();
  }, []);

  return (
    <></>
  );
};

export default Fetch;
