export var revPostServerData = (revURL, revJSONData, callback) => {
  fetch(revURL, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(revJSONData),
  })
    .catch(e => {
      console.error('>>> ERR : ' + e);
      return callback({error: e});
    })
    .then(response => response.json())
    .catch(e => {
      console.error('>>> ERR - catch : ' + e);
      return callback({error: e});
    })
    .then(revData => {
      return callback(revData);
    })
    .catch(e => {
      console.error('>>> ERR- catch - catch : ' + revURL, e);
      return callback({error: e});
    });
};

export var revUploadFile = revURL => {
  const formData = new FormData();
  const fileField = document.querySelector('input[type="file"]');

  formData.append('username', 'abc123');
  formData.append('avatar', fileField.files[0]);

  fetch(revURL, {
    method: 'PUT',
    body: formData,
  })
    .then(response => response.json())
    .then(result => {
      console.log('Success:', result);
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

export var revUploadFiles = (revURL, revFiles, callback) => {
  const formData = new FormData();

  formData.append('title', 'My Vegas Vacation');
  for (let i = 0; i < revFiles.length; i++) {
    formData.append('photos', revFiles[i]);
  }

  fetch(revURL, {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(result => {
      callback(result);
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

export const revSyncLocalData = () => {};
