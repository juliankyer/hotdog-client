const initialState = {
  model: {}
}

function isHotdog(state = initialState, action) {
  console.log(action)
  switch (action.type) {
    case 'POST_IMAGE_SUCCESS':
      return Object.assign({}, state, {
        model: action.result
      })
    default:
      return state;
  }
}

export default isHotdog;
