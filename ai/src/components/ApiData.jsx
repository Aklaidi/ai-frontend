import React, { useState, useEffect } from 'react';

function ApiData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/dashboard`;
        console.log("Fetching from URL:", url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        console.log("JSON data:", json);
        setData(json);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {error && <div>Error: {error}</div>}
      {data ? (
        // Instead of JSON.stringify(data), we access the "data" property directly.
        <p>{data.data}</p>
      ) : (
        <div>Loading data...</div>
      )}
    </div>
  );
}

export default ApiData;
