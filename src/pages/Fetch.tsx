import React, { useEffect, useState } from "react";




const Fetch = () => {
   

useEffect(() => {
  const fetchDoctors = async () => {
      const data = await getCollection("doctor");
      setDoctors(data as Doctor[]);
      console.log(data);
      console.log("fetching Docs")
      setLoading(false);
    };

    fetchDoctors();
}, []);

  return (
    <></>
  )
}

export default Fetch