import {revIsEmptyJSONObject} from '../../../rev_function_libs/rev_gen_helper_functions';

export var revPostServerData_ = (revURL, revJSONData, callback) => {
  fetch(revURL, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(revJSONData),
  })
    .then(response => {
      return response.json();
    })
    .then(revData => {
      if (!revData.body) {
        throw new Error('Response has no body');
      }

      const reader = revData.body.getReader();
      let chunks = '';

      function read() {
        reader.read().then(({done, value}) => {
          if (done) {
            const jsonData = JSON.parse(chunks);
            console.log(jsonData);
            return;
          }

          chunks += new TextDecoder('utf-8').decode(value);
          read();
        });
      }

      read();

      return callback(revData);
    })
    .catch(e => {
      console.log('>>> ERR- catch - catch : ' + revURL, e);
      return callback({error: e});
    });
};

export var revPostServerData_Chunks_ = (revURL, revJSONData, callback) => {
  fetch(revURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(revJSONData),
  })
    .then(response => {
      console.log('>>> response +++ ' + response);

      const reader = response.body.getReader();
      let chunks = '';

      function read() {
        reader.read().then(({done, value}) => {
          if (done) {
            const jsonData = JSON.parse(chunks);
            console.log('>>> jsonData ' + jsonData);
            return jsonData;
          }

          chunks += new TextDecoder('utf-8').decode(value);
          read();
        });
      }

      read();
    })
    .then(jsonData => {
      callback(jsonData);
    })
    .catch(error => console.error(error));
};

export var revPostServerData = (revURL, revJSONData, callback) => {
  const xhr = new XMLHttpRequest();

  xhr.open('POST', revURL);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onprogress = event => {
    if (event.lengthComputable) {
      const progress = Math.round((event.loaded / event.total) * 100);
      console.log(`Received ${progress}%`);
    } else {
      console.log('Received data...');
    }
  };

  xhr.onload = () => {
    if (!revIsEmptyJSONObject(xhr) && xhr.hasOwnProperty('_response')) {
      let revResponseData = {};
      try {
        revResponseData = JSON.parse(xhr._response);
      } catch (error) {
        revResponseData = {error: error};
      }

      return callback(revResponseData);
    } else {
      return callback({});
    }
  };

  const data = JSON.stringify(revJSONData);

  xhr.send(data);
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
      console.log('Error:', error);
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
      console.log('Error:', error);
    });
};

export const revSyncLocalData = () => {};
