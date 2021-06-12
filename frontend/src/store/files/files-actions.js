export const receiveFiles = files => {
  return {
    type: 'files/receiveFiles',
    files,
  };
};

export const refreshFiles = () => {
  return async dispatch => {
    fetch('/api/files')
      .then(response => {
        return response.json();
      })
      .then(json => {
        dispatch(receiveFiles(json));
      })
      .catch(err => {
        console.log(err);
      });
  };
};
