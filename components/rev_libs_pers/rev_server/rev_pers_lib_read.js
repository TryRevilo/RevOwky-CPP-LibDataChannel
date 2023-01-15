export const revGetServerData_Async = async revURL => {
  let revResponse;
  try {
    revResponse = await fetch(revURL);
  } catch (err) {
    console.log('>>> revGetServerData_Async err ::: ' + err);

    revResponse = null;
  }

  return revResponse;
};

export const revGetServerData_JSON_Async = async revURL => {
  let revResponseData = null;

  try {
    let revResponse = await revGetServerData_Async(revURL);

    if (revResponse !== null) {
      revResponseData = await revResponse.json();
    }
  } catch (error) {
    console.log('>>> revGetServerData_JSON_Async err ::: ' + err);
  }

  return revResponseData;
};
