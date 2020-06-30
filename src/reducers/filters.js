import * as types from '../constants/ActionTypes'


const filtersReducerDefaultState = {

    sortBy: "",


};

const filtersReducer = (state = filtersReducerDefaultState, action) => {
    // console.log('Action Result');
    // console.log(action);
    switch (action.type) {
        case types.SORT_BY:
            return {
                ...state,
                sortBy: action.sort_by
            };

        default:
            return state;
    }
}

export default filtersReducer;