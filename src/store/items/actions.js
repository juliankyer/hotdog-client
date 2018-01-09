export function addItem(text) {
  return { type: 'ADD_ITEM', text };
}

export function postImageSuccess(result) {
  return {
    type: 'POST_IMAGE_SUCCESS',
    result
  }
}

export function postImageFailure(result) {
  return {
    type: 'POST_IMAGE_FAILURE',
    result
  }
}

export function postImage(formData) {
  return function(dispatch) {
    fetch('https://hotdog-server-team07.herokuapp.com/is_hotdog', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        dispatch(postImageSuccess(response))
      })
      .catch(error => {
        console.log(error)
        dispatch(postImageFailure(error))
      })
    }
}
